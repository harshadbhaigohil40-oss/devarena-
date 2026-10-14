const Message = require('../models/Message');

exports.getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params; // The other user
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json({
      status: 'success',
      data: { messages }
    });
  } catch (err) {
    next(err);
  }
};

exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.userId;

    // Aggregation to get the latest message per conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', currentUserId] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.password': 0,
          'user.email': 0
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({
      status: 'success',
      data: { conversations }
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { userId } = req.params; // The sender whose messages we are reading
    const currentUserId = req.userId;

    await Message.updateMany(
      { senderId: userId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};
