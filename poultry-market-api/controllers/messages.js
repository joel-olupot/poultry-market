const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { userId } = req.params;
  const { sender } = req.query;

  const messages = await Message.find({
    $or: [
      { sender: userId, receiver: sender },
      { sender: sender, receiver: userId },
    ],
  })
    .populate('sender', 'name')
    .populate('receiver', 'name');

  res.status(200).json(messages);
};

const sendMessage = async (req, res) => {
  const { sender, receiver, content } = req.body;

  const message = await Message.create({ sender, receiver, content });
  res.status(201).json(message);
};

module.exports = { getMessages, sendMessage };
