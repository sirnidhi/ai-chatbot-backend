const express = require('express');
const {
  getDashboardStats,
  getQueryLogs,
  getUsers,
  getUserActivity,
  getSystemHealth,
  toggleUserStatus
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/logs', getQueryLogs);
router.get('/users', getUsers);
router.get('/users/:userId/activity', getUserActivity);
router.get('/health', getSystemHealth);
router.patch('/users/:userId/toggle', toggleUserStatus);

module.exports = router;