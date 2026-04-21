import { RefreshToken } from '../db/models/RefreshToken';

const saveRefreshToken = async (userId: string, newRefreshToken: string) => {
  const refreshToken = await RefreshToken.findOne({ where: { userId } });

  if (!refreshToken) {
    await RefreshToken.create({ userId, refreshToken: newRefreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

    return;
  }

  refreshToken.refreshToken = newRefreshToken;
  await refreshToken.save();
};

const getByToken = (refreshToken: string) => {
  return RefreshToken.findOne({ where: { refreshToken } });
};

const removeRefreshToken = (refreshToken: string) => {
  return RefreshToken.destroy({ where: { refreshToken } });
};

export const tokenService = {
  saveRefreshToken,
  getByToken,
  removeRefreshToken,
};
