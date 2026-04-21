import { Request, Response } from "express";
import { commentService } from "../services/comment.service";

const getUserCommentsByJobId = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const comments = await commentService.getCommentsByUserAndJob(userId, String(jobId));
    return res.json(comments);
  } catch (err) {
    console.error("Error fetching user comments:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const createUserCommentByJobId = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;
    const { text } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const comment = await commentService.createComment(userId, String(jobId), text);

    return res.status(201).json({ comment });
  } catch (err) {
    console.error("Error in createUserCommentByJobId:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserComment = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { commentId } = req.params;
  const { text } = req.body;

  try {
    const updatedComment = await commentService.updateCommentById(String(userId), String(commentId), text);
    res.status(200).json({ comment: updatedComment });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { commentId } = req.params;

  try {
    await commentService.deleteComment(userId!, String(commentId));
    res.status(200).json({ message: "Comment deleted" });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const getCommentsByJobIds = async (req: Request, res: Response) => {
  try {
    const { jobIds } = req.query;
    const userId = req.user?.id;

    if (!jobIds || typeof jobIds !== "string") {
      return res.status(400).json({ message: "jobIds are required" });
    }

    const idsArray = jobIds.split(",");

    const comments = await commentService.getCommentsByJobIds(
      idsArray,
      String(userId),
    );

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const commentController = {
  getUserCommentsByJobId,
  createUserCommentByJobId,
  updateUserComment,
  deleteCommentById,
  getCommentsByJobIds,
};