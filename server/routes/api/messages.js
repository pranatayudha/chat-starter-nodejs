const router = require("express").Router();
const { Conversation, Message, User } = require("../../db/models");
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
        await Message.update(
          { hasRead: true },
          {
            where: {
              conversationId,
            },
          },
          { transaction }
        );

        const conversations = await Conversation.findAll(
          {
            where: {
              [Op.or]: {
                user1Id: userId,
                user2Id: userId,
              },
            },
            attributes: ["id"],
            order: [[Message, "createdAt", "ASC"]],
            include: [
              { model: Message, order: ["createdAt", "ASC"] },
              {
                model: User,
                as: "user1",
                where: {
                  id: {
                    [Op.not]: userId,
                  },
                },
                attributes: ["id", "username", "photoUrl"],
                required: false,
              },
              {
                model: User,
                as: "user2",
                where: {
                  id: {
                    [Op.not]: userId,
                  },
                },
                attributes: ["id", "username", "photoUrl"],
                required: false,
              },
            ],
          },
          { transaction }
        );

        for (let i = 0; i < conversations.length; i++) {
          const convo = conversations[i];
          const convoJSON = convo.toJSON();

          // set a property "otherUser" so that frontend will have easier access
          if (convoJSON.user1) {
            convoJSON.otherUser = convoJSON.user1;
            delete convoJSON.user1;
          } else if (convoJSON.user2) {
            convoJSON.otherUser = convoJSON.user2;
            delete convoJSON.user2;
          }

          // set property for online status of the other user
          if (onlineUsers.includes(convoJSON.otherUser.id)) {
            convoJSON.otherUser.online = true;
          } else {
            convoJSON.otherUser.online = false;
          }

          // set properties for notification count and latest message preview
          convoJSON.latestMessageText = convoJSON.messages.slice(-1)[0].text;
          convoJSON.countNewMessage =
            convoJSON.messages.slice(-1)[0].senderId !== req.user.id
              ? convoJSON.messages.filter((m) => !m.hasRead).length
              : 0;

          conversations[i] = convoJSON;
        }

        await transaction.commit();
        res.json(conversations);
      }
    }
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

module.exports = router;
