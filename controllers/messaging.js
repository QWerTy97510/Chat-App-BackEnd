// INCLUDES
const Message = require("../models/message");

const mergeSort = require("../middleware/mergeSort");

const mySocket = require("../socket");

module.exports.postMessage = async (req, res, next) => {
  const from = req.username;
  const messagingWith = req.params.messagingWith;
  const content = req.body.content;

  try {
    const message = new Message({
      from: from,
      to: messagingWith,
      content: content,
    });

    const messageResponse = await message.save();

    const io = mySocket.getIO();
    io.emit("sendMessage", {
      message: message,
      userTo: messagingWith,
      userFrom: from,
    });

    res.json({
      message: `Message sent from ${from} to ${messagingWith}`,
      sentAt: messageResponse.createdAt.toLocaleTimeString(),
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getMessages = async (req, res, next) => {
  const user = req.username;
  const messagingWith = req.params.messagingWith;

  try {
    const messages__user = await Message.find({
      $and: [{ from: user }, { to: messagingWith }],
    });

    const messages__messagingWith = await Message.find({
      $and: [{ from: messagingWith }, { to: user }],
    });

    const messages = [...messages__user, ...messages__messagingWith];

    const formatedMessages = messages.map((msg) => {
      return {
        id: msg._id,
        from: msg.from,
        to: msg.to,
        content: msg.content,
        sentAt: msg.createdAt.getTime(),
      };
    });

    const orderedMessages = mergeSort(formatedMessages);

    res.status(200).json({ messages: orderedMessages });
  } catch (err) {
    console.log(err);
  }
};
