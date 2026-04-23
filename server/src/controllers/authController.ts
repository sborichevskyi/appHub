import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { validateService } from "../utils/validation";
import * as userModel from "../services/user.service";
import { sendActivationEmail } from "../services/email.service";
import { User } from "../db/models/User";
import { jwtService } from "../services/jwt.service";
import { tokenService } from "../services/token.service";

const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const isValidPassword = validateService.isPassword(password);
    const isValidEmail = validateService.isEmail(email);

    if (!isValidEmail) {
      return res.status(400).json({ message: "Use valid email" });
    }

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Use valid password (8+ chars, 1+ special symbol...)",
      });
    }

    const isUserExist = await userModel.findByEmail(email);

    if (isUserExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (!name) {
      return res.status(400).json({ message: "Name are required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(name, email, passwordHash);
    const activationBaseUrl =
      process.env.ACTIVATION_BASE_URL || "https://app-hub-wheat.vercel.app/auth/activate";
    if (!newUser.activationToken) {
      throw new Error("Activation token was not generated");
    }

    const activationLink = `${activationBaseUrl}?token=${encodeURIComponent(
      newUser.activationToken,
    )}`;

    await sendActivationEmail({ to: email, activationLink });

    console.log(newUser.activationToken);
    const user = userModel.normalizeUser(newUser);

    return res.status(201).json(user);
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    return res.status(500).json({
      message: "Registration failed",
      error: err,
    });
  }
};

const activate = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Activation token is required" });
    }

    const user = await userModel.activateByToken(String(token));

    if (!user) {
      return res.status(404).json({ message: "Invalid activation token" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true as const,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true as const,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 5 * 60 * 1000,
    });

    return res.status(200).json({ message: "activated" });
  } catch (err) {
      console.error("ACTIVATION ERROR:", err);
      
      return res.status(500).json({ message: "Activation failed" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is not activated" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const tokens = await generateTokens(user);

    const normalizedUser = userModel.normalizeUser(user);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true as const,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: normalizedUser,
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const userData = jwtService.verifyRefreshToken(refreshToken);

    if (!userData) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await userModel.findById(userData.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tokens = await generateTokens(user);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true as const,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: userModel.normalizeUser(user),
      accessToken: tokens.accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: "Refresh failed" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await tokenService.removeRefreshToken(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true as const,
      sameSite: "none",
      secure: true,
      path: "/",
      maxAge: 0,
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

const generateTokens = async (user: User) => {
  const accessToken = jwtService.signAccessToken(user);
  const refreshToken = jwtService.signRefreshToken(user);

  await tokenService.saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json(req.user);
};

export const authController = {
  register,
  activate,
  login,
  refresh,
  logout,
  me,
};
