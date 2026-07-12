import { Setting } from '../../models/Setting.js';

export const getSettings = () => Setting.getGlobal();

export const updateSettings = async (data) => {
  const setting = await Setting.getGlobal();
  if (data.esgWeights) Object.assign(setting.esgWeights, data.esgWeights);
  if (data.flags) Object.assign(setting.flags, data.flags);
  await setting.save();
  return setting;
};
