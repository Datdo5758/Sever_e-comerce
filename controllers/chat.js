const Chat = require("../models/chat");

exports.getMessageByUserId = (req, res, next) => {
  const userId = req.params.userId;

  Chat.find({ userId: userId })
    .then(roomChat => res.status(200).json(roomChat))
    .catch(err => console.log(err));
};

exports.createNewRoom = (req, res, next) => {
  const newRoom = req.body;

  const chat = new Chat({
    userId: newRoom.userId,
    content: newRoom.content,
  });
  chat
    .save()
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
};
exports.addMessage = (req, res, next) => {
  const data = req.body;
  const userId = data.userId;

  Chat.findOne({ userId: userId }) // Sử dụng findOne thay vì find để tìm một đối tượng đơn lẻ
    .then(roomChat => {
      if (!roomChat) {
        // Xử lý trường hợp không tìm thấy đối tượng
        throw new Error("Room chat not found");
      }

      roomChat.content = data.content;
      roomChat.userId = userId;
      return roomChat.save(); // Lưu lại roomChat sau khi cập nhật
    })
    .then(updatedRoomChat => {
      res.json(updatedRoomChat); // Trả về dữ liệu đã được cập nhật
    })
    .catch(err => console.log(err));
};

exports.getAllRoom = (req, res, next) => {
  Chat.find()
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
};
