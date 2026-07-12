import { CarbonTransaction } from '../models/CarbonTransaction.js';
import { EmissionFactor } from '../models/EmissionFactor.js';
import { Setting } from '../models/Setting.js';
import { AppError } from '../utils/AppError.js';
import { getIO } from '../config/socket.js';
import { SOCKET_EVENTS } from '../sockets/events.js';
import { computeDepartmentScore } from './scoreEngine.js';
import { logger } from '../utils/logger.js';

// Business rule: auto emission calc. If flags.autoEmissionCalc is on, a
// source payload (qty + factor) is turned into a CarbonTransaction with
// co2Amount computed for you (activityData * factor.value, via the model's
// pre-validate hook) — no manual entry.
export const generateCarbonTransaction = async ({
  department,
  sourceType,
  sourceRef,
  activityData,
  emissionFactor,
  date,
  createdBy,
}) => {
  const settings = await Setting.getGlobal();
  if (!settings.flags.autoEmissionCalc) {
    throw new AppError(422, 'Auto emission calculation is disabled in settings');
  }

  const factor = await EmissionFactor.findById(emissionFactor);
  if (!factor) throw new AppError(404, 'Emission factor not found');

  const transaction = await CarbonTransaction.create({
    department,
    sourceType,
    sourceRef,
    activityData,
    emissionFactor,
    date: date || new Date(),
    createdBy,
  });

  try {
    getIO().emit(SOCKET_EVENTS.CARBON_NEW, transaction);
  } catch (err) {
    logger.warn({ err }, 'Socket not available — skipping CARBON_NEW emit');
  }

  try {
    await computeDepartmentScore(department);
  } catch (err) {
    logger.warn({ err }, 'Score recompute failed after carbon transaction');
  }

  return transaction;
};
