const express = require('express');
const notificationRouter = express.Router();
const NotificationModel = require('../model/notificationModel');
const GroceryModel = require('../model/groceryModel');
const { UserModel } = require('../model/userModel');
const { sendMail } = require('../utils/mail');
const { getExpiryStatus } = require('../utils/expiryHelper');

// Get all notifications for a user
notificationRouter.get('/user/:userId', async (req, res) => {
  try {
    const notifications = await NotificationModel.find({ user: req.params.userId })
      .populate('grocery')
      .sort({ createdAt: -1 });
    
    res.json({
      count: notifications.length,
      notifications
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Get unread notification count
notificationRouter.get('/unread/:userId', async (req, res) => {
  try {
    const unreadCount = await NotificationModel.countDocuments({
      user: req.params.userId,
      isRead: false
    });
    
    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching unread count', error: err.message });
  }
});

// Mark notification as read
notificationRouter.put('/read/:notificationId', async (req, res) => {
  try {
    const notification = await NotificationModel.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification', error: err.message });
  }
});

// Mark all notifications as read
notificationRouter.put('/read-all/:userId', async (req, res) => {
  try {
    await NotificationModel.updateMany(
      { user: req.params.userId, isRead: false },
      { isRead: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notifications', error: err.message });
  }
});

// Delete a notification
notificationRouter.delete('/delete/:notificationId', async (req, res) => {
  try {
    const deleted = await NotificationModel.findByIdAndDelete(req.params.notificationId);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
});

// Internal function to create notification and send email
const createExpiryNotification = async (userId, groceryId, expiryDate) => {
  try {
    const grocery = await GroceryModel.findById(groceryId);
    const user = await UserModel.findById(userId);
    
    if (!grocery || !user) {
      throw new Error('Grocery or User not found');
    }
    
    const expiryStatus = getExpiryStatus(expiryDate);
    let notificationType, title, message, subject;
    
    // Determine notification type based on days left
    if (expiryStatus.daysLeft < 0) {
      notificationType = 'expired';
      title = `${grocery.name} has expired!`;
      message = `Your ${grocery.name} expired ${Math.abs(expiryStatus.daysLeft)} days ago. Please remove it from your pantry.`;
      subject = `⛔ Alert: ${grocery.name} has expired!`;
    } else if (expiryStatus.daysLeft === 0) {
      notificationType = 'expiry-critical';
      title = `${grocery.name} expires today!`;
      message = `Your ${grocery.name} expires today. Use it soon or discard it.`;
      subject = `🚨 Alert: ${grocery.name} expires today!`;
    } else if (expiryStatus.daysLeft <= 2) {
      notificationType = 'expiry-critical';
      title = `${grocery.name} expiring soon!`;
      message = `Your ${grocery.name} will expire in ${expiryStatus.daysLeft} day(s) on ${expiryDate.toDateString()}.`;
      subject = `⚠️ Alert: ${grocery.name} expiring in ${expiryStatus.daysLeft} day(s)!`;
    } else {
      notificationType = 'expiry-warning';
      title = `${grocery.name} expiring soon`;
      message = `Your ${grocery.name} will expire in ${expiryStatus.daysLeft} days on ${expiryDate.toDateString()}.`;
      subject = `📢 Reminder: ${grocery.name} expiring in ${expiryStatus.daysLeft} days`;
    }
    
    // Create notification in database
    const notification = await NotificationModel.create({
      user: userId,
      grocery: groceryId,
      type: notificationType,
      title,
      message,
      expiryDate
    });
    
    // Send email notification
    try {
      await sendMail({
        email: user.email,
        subject,
        message: `Hi ${user.name},\n\n${message}\n\nStorage Tips: ${grocery.storageTips || 'Store in a cool, dry place.'}\n\nThank you,\nSmartPantry Team`
      });
      
      // Mark email as sent
      await NotificationModel.findByIdAndUpdate(notification._id, { emailSent: true });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue even if email fails
    }
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = { notificationRouter, createExpiryNotification };
