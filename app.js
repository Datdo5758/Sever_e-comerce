const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

require("dotenv").config();

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const chatRoutes = require("./routes/chat");
const adminRoutes = require("./routes/admin");

const app = express();

// Sử dụng cổng mà bạn đã định nghĩa trong tệp .env
const port = process.env.PORT || 8000;
const databaseURL = process.env.DATABASE_URL;
const store = new MongoDBStore({
  uri: databaseURL,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(cors());
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images")
);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "supersecrettoken",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: true, // Bật tùy chọn secure
      httpOnly: true, // Bật tùy chọn httpOnly
    },
  })
);

app.use("/users", userRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use("/chatrooms", chatRoutes);
app.use(adminRoutes);
// app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    const server = app.listen(port);
    const io = require("./socket").init(server);

    io.on("connection", socket => {
      console.log("Client connected");

      // Xử lý khi máy khách gửi tin nhắn
      socket.on("send_message", message => {
        console.log("Received message:", message);

        // Gửi lại tin nhắn cho tất cả các máy khách kết nối
        io.emit("receive_message", message);
      });
    });
  })
  .catch(err => console.log(err));
