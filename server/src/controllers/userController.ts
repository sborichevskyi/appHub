import { Request, Response } from 'express';
import * as userModel from '../services/user.service';

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();

    res.status(200).json(users);
  } catch (error) {}
};

export const userController = {
  getAllUsers,
};