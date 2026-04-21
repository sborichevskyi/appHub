import crypto from 'crypto';

import { User } from '../db/models/User';

export const normalizeUser = (user: User) => {
  const plainUser = user?.get ? user.get({ plain: true }) : user;

  return {
    id: plainUser.id,
    name: plainUser.name,
    email: plainUser.email,
    isActive: plainUser.isActive,
  };
};

export const getAllUsers = async () => {
  const users = await User.findAll();

  return users.map((user) => normalizeUser(user));
};

export const findByEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  
  return user ? user : null;
};

export const findById = async (id: string) => {
  const user = await User.findByPk(id);
  
  return user ? user : null;
}

export const createUser = async (name: string, email: string, passwordHash: string) => {
  const activationToken = crypto.randomBytes(32).toString('hex');
  const newUser = await User.create({ name, email, passwordHash, activationToken, isActive: false });

  return newUser;
};

export const activateByToken = async (token: string) => {
  const user = await User.findOne({ where: { activationToken: token } });

  if (!user) {
    return null;
  }

  user.isActive = true;
  user.activationToken = null;
  await user.save();

  return user;
};
