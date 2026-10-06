import { Request, Response } from 'express';
import * as userModel from '../services/user.service';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'No user in request' });
    }

    const users = await userModel.getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error fetching users',
    });
  }
};

export const userController = {
  getAllUsers,
};
