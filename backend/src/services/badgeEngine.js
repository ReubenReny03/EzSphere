import { Badge } from '../models/Badge.js';
import { User } from '../models/User.js';
import { Setting } from '../models/Setting.js';
import { notify } from './notify.js';
import { getIO } from '../config/socket.js';
import { SOCKET_EVENTS } from '../sockets/events.js';
import { logger } from '../utils/logger.js';

// Evaluate all active badges' unlockRule against a user's current metrics;
// award any newly-satisfied badges. Called after any xp/challengesCompleted/
// csrCount change so badges unlock the moment a threshold is crossed.
export const evaluateAndAwardBadges = async (userId) => {
  const settings = await Setting.getGlobal();
  if (!settings.flags.autoAwardBadges) return [];

  const user = await User.findById(userId);
  if (!user) return [];

  const ownedIds = new Set(user.badges.map((id) => id.toString()));
  const candidateBadges = await Badge.find({ status: 'active', _id: { $nin: user.badges } });

  const newlyAwarded = candidateBadges.filter((badge) => {
    if (ownedIds.has(badge._id.toString())) return false;
    const value = user[badge.unlockRule.metric] ?? 0;
    return value >= badge.unlockRule.threshold;
  });

  if (newlyAwarded.length === 0) return [];

  user.badges.push(...newlyAwarded.map((b) => b._id));
  await user.save();

  await Promise.all(
    newlyAwarded.map(async (badge) => {
      await notify({
        recipientId: userId,
        type: 'BADGE_UNLOCK',
        title: 'Badge unlocked!',
        message: `You unlocked the "${badge.name}" badge.`,
        related: { kind: 'Badge', id: badge._id },
      });

      try {
        getIO().to(`user:${userId}`).emit(SOCKET_EVENTS.BADGE_UNLOCKED, {
          userId,
          badge,
        });
      } catch (err) {
        logger.warn({ err }, 'Socket not available — skipping BADGE_UNLOCKED emit');
      }
    }),
  );

  return newlyAwarded;
};
