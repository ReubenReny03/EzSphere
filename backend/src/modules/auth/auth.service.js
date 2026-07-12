import jwt from 'jsonwebtoken';
import { User } from '../../models/User.js';
import { Department } from '../../models/Department.js';
import { AppError } from '../../utils/AppError.js';
import { env } from '../../config/env.js';

const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES,
  });

export const register = async ({ name, email, password, role, department, title }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(409, 'Email already registered');

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role,
    department,
    title,
  });

  if (department) await Department.recomputeEmployeeCount(department);

  const token = signToken(user);
  const safeUser = await User.findById(user._id).populate('department', 'name code');
  return { user: safeUser, token };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash').populate('department', 'name code');
  if (!user) throw new AppError(401, 'Invalid credentials');

  const valid = await user.comparePassword(password);
  if (!valid) throw new AppError(401, 'Invalid credentials');

  if (user.status !== 'active') throw new AppError(403, 'Account is inactive');

  const token = signToken(user);
  user.passwordHash = undefined;
  return { user, token };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId).populate('department', 'name code').populate('badges');
  if (!user) throw new AppError(404, 'User not found');
  return user;
};
