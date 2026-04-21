import { Op } from "sequelize";
import { Comment } from "../db/sequalize";

const getCommentsByUserAndJob = async (userId: string, jobId: string) => {
  try {
    const comments = await Comment.findAll({
      where: {
        userId,
        jobId,
      },
      order: [["createdAt", "ASC"]],
    });

    return comments;
  } catch (err) {
    console.error("Error in getCommentsByUserAndJob:", err);
    throw err;
  }
};

const createComment = async (userId: string, jobId: string, text: string) => {
  try {
    const comment = await Comment.create({
      userId,
      jobId,
      text,
    });

    return comment;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err;
  }
};

export const updateCommentById = async (userId: string, commentId: string, text: string) => {
  const comment = await Comment.findOne({ where: { id: commentId, userId } });
  if (!comment) throw new Error("Comment not found");
  comment.text = text;
  await comment.save();
  return comment;
};

const deleteComment = async (userId: string, commentId: string) => {
  const deleted = await Comment.destroy({
    where: { id: commentId, userId }
  });

  if (!deleted) {
    throw new Error("Comment not found or not owned by user");
  }

  return true;
};

export const getCommentsByJobIds = async (
  jobIds: string[],
  userId: string
) => {
  return Comment.findAll({
    where: {
      jobId: {
        [Op.in]: jobIds,
      },
      userId,
    },
    order: [["createdAt", "ASC"]],
  });
};

export const commentService = {
  getCommentsByUserAndJob,
  createComment,
  updateCommentById,
  deleteComment,
  getCommentsByJobIds,
};