const User = require('../models/User');
const Conversation = require('../models/Conversation');
const QueryLog = require('../models/QueryLog');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalConversations,
      totalQueries,
      todayQueries,
      providerStats
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Conversation.countDocuments({ isActive: true }),
      QueryLog.countDocuments(),
      QueryLog.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      QueryLog.aggregate([
        {
          $group: {
            _id: '$aiProvider',
            count: { $sum: 1 },
            totalTokens: { $sum: '$tokens' },
            avgResponseTime: { $avg: '$responseTime' }
          }
        }
      ])
    ]);

    const errorRate = await QueryLog.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalConversations,
        totalQueries,
        todayQueries,
        providerStats,
        errorRate
      }
    });
  } catch (error) {
    logger.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

const getQueryLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      provider,
      userId,
      startDate,
      endDate
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (provider) filter.aiProvider = provider;
    if (userId) filter.userId = userId;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await QueryLog.find(filter)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await QueryLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get query logs error:', error);
    res.status(500).json({ error: 'Failed to get query logs' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [user, conversations, queryStats] = await Promise.all([
      User.findById(userId).select('-password'),
      Conversation.find({ userId, isActive: true })
        .select('title createdAt totalTokens aiProvider')
        .sort({ updatedAt: -1 })
        .limit(10),
      QueryLog.aggregate([
        {
          $match: {
            userId: require('mongoose').Types.ObjectId(userId),
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            },
            queries: { $sum: 1 },
            tokens: { $sum: '$tokens' },
            avgResponseTime: { $avg: '$responseTime' }
          }
        },
        { $sort: { '_id.date': 1 } }
      ])
    ]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user,
      conversations,
      queryStats
    });
  } catch (error) {
    logger.error('Get user activity error:', error);
    res.status(500).json({ error: 'Failed to get user activity' });
  }
};

const getSystemHealth = async (req, res) => {
  try {
    const providerHealth = await aiService.getProviderHealth();
    
    const dbHealth = {
      connected: require('mongoose').connection.readyState === 1,
      collections: {
        users: await User.estimatedDocumentCount(),
        conversations: await Conversation.estimatedDocumentCount(),
        queryLogs: await QueryLog.estimatedDocumentCount()
      }
    };

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      providers: providerHealth,
      database: dbHealth,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    logger.error('System health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    logger.info(`User ${userId} status toggled to ${user.isActive ? 'active' : 'inactive'}`);

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    logger.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to toggle user status' });
  }
};

module.exports = {
  getDashboardStats,
  getQueryLogs,
  getUsers,
  getUserActivity,
  getSystemHealth,
  toggleUserStatus
};