import { UserProfile } from "../db/models/UserProfile";

const getProfile = async (userId: string) => {
  try {
    const profile = await UserProfile.findOne({ where: { userId } });
    return profile;
  } catch (error) {
    throw new Error('Failed to get profile');
  }
};

const setProfile = async (userId: string, role: string, keywords: string[], country: string, location: string, level: string) => {
  try {
    const [profile, created] = await UserProfile.upsert(
      {
        userId,
        role: role,
        keywords: keywords,
        country: country,
        location: location,
        level,
      },
      {
        returning: true,
      }
    );
    
    return profile;
  } catch (error) {
    throw new Error('Failed to set profile');
  }
};

export const profileService = {
  getProfile,
  setProfile,
};