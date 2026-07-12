import { Department } from '../models/Department.js';
import { EmissionFactor } from '../models/EmissionFactor.js';
import { generateCarbonTransaction } from '../services/emissionEngine.js';
import { logger } from '../utils/logger.js';

const INTERVAL_MS = 8000;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Optional: emits a live CarbonTransaction every ~8s so the dashboard visibly
// "lives" during a demo. Toggle via ENABLE_SIMULATOR — never runs otherwise.
export const startSimulator = async () => {
  const [departments, factors] = await Promise.all([
    Department.find({ status: 'active' }).lean(),
    EmissionFactor.find({ status: 'active' }).lean(),
  ]);

  if (departments.length === 0 || factors.length === 0) {
    logger.warn('Simulator: no departments/emission factors found — skipping');
    return;
  }

  setInterval(async () => {
    try {
      const department = pick(departments);
      const factor = pick(factors);
      await generateCarbonTransaction({
        department: department._id,
        sourceType: factor.activityType,
        sourceRef: 'SIMULATOR',
        activityData: Math.round(Math.random() * 200) + 10,
        emissionFactor: factor._id,
        date: new Date(),
      });
    } catch (err) {
      logger.warn({ err }, 'Simulator tick failed');
    }
  }, INTERVAL_MS);

  logger.info(`Simulator started — emitting a carbon transaction every ${INTERVAL_MS / 1000}s`);
};
