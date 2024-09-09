const Notification = require("../models/notificationsModel"); // Assuming you have a notification model

// Function to add a notification
const addNotification = async ({ title, user, onClick, description }) => {
  try {
    const newNotification = new Notification({
      title,
      user,
      onClick,
      description,
      read: false,
    });
    await newNotification.save();
  } catch (error) {
    console.error("Error sending notification:", error.message);
  }
};

module.exports = { addNotification };
