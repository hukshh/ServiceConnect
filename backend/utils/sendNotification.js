/**
 * Utility to send a real-time notification to a specific user via Socket.io
 * 
 * @param {Object} io - The initialized socket.io Server instance
 * @param {Map} connectedUsers - Map storing userId -> socketId
 * @param {String} userId - The stringified MongoDB ObjectId of the user to notify
 * @param {Object} notification - The notification payload
 */
const sendNotification = (io, connectedUsers, userId, notification) => {
  const socketId = connectedUsers.get(userId.toString());
  
  if (socketId) {
    const payload = {
      ...notification,
      timestamp: new Date()
    };
    
    io.to(socketId).emit('notification', payload);
    console.log(`Notification sent to User ${userId}: ${notification.message}`);
  } else {
    // Note: In a full production app, you would save this to a Notifications DB collection 
    // here so the user can read it next time they log in. Since we are doing purely 
    // real-time notifications for Phase 5 to demonstrate websockets, we just log it.
    console.log(`User ${userId} is offline. Notification NOT sent.`);
  }
};

module.exports = sendNotification;
