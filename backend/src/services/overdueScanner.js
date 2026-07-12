import cron from 'node-cron';
import { ComplianceIssue } from '../models/ComplianceIssue.js';
import { Notification } from '../models/Notification.js';
import { notify } from './notify.js';
import { logger } from '../utils/logger.js';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Flags Open/Under Review compliance issues whose dueDate has passed and
// notifies the owner — at most once per issue per day, to avoid spam.
export const scanOverdueCompliance = async () => {
  const overdue = await ComplianceIssue.find({
    status: { $in: ['Open', 'Under Review'] },
    dueDate: { $lt: new Date() },
  });

  await Promise.all(
    overdue.map(async (issue) => {
      const recentlyNotified = await Notification.findOne({
        recipient: issue.owner,
        type: 'COMPLIANCE_ISSUE',
        'related.id': issue._id,
        createdAt: { $gt: new Date(Date.now() - ONE_DAY_MS) },
      });
      if (recentlyNotified) return;

      await notify({
        recipientId: issue.owner,
        type: 'COMPLIANCE_ISSUE',
        title: 'Compliance issue overdue',
        message: `"${issue.title}" is overdue (due ${issue.dueDate.toDateString()}).`,
        related: { kind: 'ComplianceIssue', id: issue._id },
      });
    }),
  );

  logger.info({ count: overdue.length }, 'overdueScanner: compliance scan complete');
  return overdue.length;
};

export const startOverdueScanner = () => {
  // every hour, on the hour
  cron.schedule('0 * * * *', () => {
    scanOverdueCompliance().catch((err) => logger.error({ err }, 'overdueScanner failed'));
  });
  logger.info('overdueScanner cron scheduled (hourly)');
};
