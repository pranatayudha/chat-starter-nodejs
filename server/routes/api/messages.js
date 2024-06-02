const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const db = require("../../db");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId,
        hasRead: false,
      });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
      hasRead: false,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/:conversationId", async (req, res, next) => {
  const transaction = await db.transaction();

  try {
    if (!req.user) {
      await transaction.rollback();

      return res.sendStatus(401);
    }

    const userId = req.user.id;
    const conversationId = req.params.conversationId;

    let conversation = await Conversation.findOne(
      {
        where: {
          id: conversationId,
        },
      },
      { transaction }
    );

    if (!conversation) {
      await transaction.rollback();

      res.status(404).json({ error: "Conversation not found" });
    }

    let message = await Message.findAll(
      {
        where: {
          conversationId,
        },
      },
      { transaction }
    );

    if (!message) {
      await transaction.rollback();

      res.status(404).json({ error: "Message not found" });
    }

    if (message.filter((m) => !m.hasRead).length > 0) {
      conversation = await Conversation.findOne(
        {
          where: {
            id: conversationId,
            [Op.or]: {
              user1Id: userId,
              user2Id: userId,
            },
          },
        },
        { transaction }
      );

      if (conversation) {
        const updateMessage = await Message.update(
          { hasRead: true },
          {
            where: {
              conversationId,
            },
          },
          { transaction }
        );

        message = await Message.findOne(
          {
            where: {
              id: updateMessage,
            },
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.json({ message });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

module.exports = router;
