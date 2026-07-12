import { Notification } from '../models/Notification.js';
import { Setting } from '../models/Setting.js';
import { getIO } from '../config/socket.js';
import { SOCKET_EVENTS } from '../sockets/events.js';
import { logger } from '../utils/logger.js';

// Email adapter stub — logs instead of sending; swap for nodemailer later.
const sendEmailStub = async (recipientId, title, message) => {
  logger.info({ recipientId, title, message }, 'EMAIL STUB: would send email');
};

export const notify = async ({ recipientId, type, title, message, link = null, related = null }) => {
  const notification = await Notification.create({
    recipient: recipientId,
    type,
    title,
    message,
    link,
    related,
  });

  try {
    getIO().to(`user:${recipientId}`).emit(SOCKET_EVENTS.NOTIFICATION_NEW, notification);
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping realtime emit');
  }

  const settings = await Setting.getGlobal();
  if (settings.flags.emailAlerts) {
    await sendEmailStub(recipientId, title, message);
  }

  return notification;
};
