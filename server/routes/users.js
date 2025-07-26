const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const Task = require('../models/Task');

// Get all users (admin only)

router.get('/', authenticate, async (req, res) => {
  console.log(req.user.role, "todaysconsole");
  const role = req.user.role;
  const userId = req.user._id;

  try {
    if (role === 'admin') {
      // ✅ Admin logic (unchanged)
      const users = await User.find()
        .select('-password')
        .populate('managerId', 'name email');
      return res.json(users);
    }

    if (role === 'manager') {
      // 🔄 New logic for managers
      const tasks = await Task.find({ createdBy: userId }).select('assignedTo');
      
      const assignedUserIds = tasks.map(task => task.assignedTo.toString());

      // Remove duplicates
      const uniqueUserIds = [...new Set(assignedUserIds)];

      // Fetch user details (excluding password)
      const users = await User.find({ _id: { $in: uniqueUserIds } }).select('-password');

      return res.json(users);
    }

    // 🚫 For other roles
    return res.status(403).json({ message: 'Access denied' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all users with role 'user' (admin and manager only)
router.get('/available', [authenticate, authorize('admin', 'manager')], async (req, res) => {
  try {
   
    const users = await User.find({ role: 'user' })
      .select('-password')
      .populate('managerId', 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Get users under management (for managers)
router.get('/managed', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Only managers can view their managed users' });
    }

    const managedUsers = await User.find({ managerId: req.user._id })
      .select('-password');
    res.json(managedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.patch('/:id/role', [
  authenticate,
  authorize('admin'),
  body('role').isIn(['admin', 'manager', 'user'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// delete user form website

router.delete('/:id', [
  authenticate,
  authorize('admin') // Only admins can delete users
], async (req, res) => {
  try {
    console.log("jjjjjjjj")
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Assign manager to user (admin only)
router.patch('/:id/manager', [
  authenticate,
  authorize('admin'),
  body('managerId').isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const manager = await User.findOne({ _id: req.body.managerId, role: 'manager' });
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    user.managerId = manager._id;
    await user.save();

    res.json({ message: 'Manager assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove manager from user (admin only)
router.delete('/:id/manager', [authenticate, authorize('admin')], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.managerId = null;
    await user.save();

    res.json({ message: 'Manager removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 