import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { jobQueue } from '../queue/jobQueue';

const setProfile = async (req: Request, res: Response) => {
  try {
    const { role, keywords, country, location, level } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const profile = await profileService.setProfile(userId, role, keywords, country, location, level);
    
    jobQueue.add('fetch-jobs', { profileId: profile.id });
    
    res.status(200).json({ message: 'Profile set successfully', profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set profile' });
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const userId = req.user.id;

    const profile = await profileService.getProfile(userId);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get profile' });
    }
};

export const profileController = {
  setProfile,
  getProfile,
};