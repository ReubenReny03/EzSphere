import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from '../utils/constants.js';

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    read: { type: Boolean, default: false },
    link: { type: String, trim: true },
    related: {
      kind: { type: String, trim: true },
      id: { type: Schema.Types.ObjectId },
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // TTL 30d

export const Notification = mongoose.model('Notification', notificationSchema);
