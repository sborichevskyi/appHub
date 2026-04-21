import { useState } from "react";
import type { Comment } from "../../features/comments/commentsApi";
import "./CommentCard.scss";

interface CommentCardProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, text: string) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleSave = () => {
    if (editedText.trim() && editedText !== comment.text) {
      onUpdate(comment.id, editedText);
    }
    setIsEditing(false);
  };

  return (
    <div className="comment-card" onDoubleClick={() => setIsEditing(true)}>
      <button
        className="comment-card__delete"
        onClick={() => onDelete(comment.id)}
      >
        ✕
      </button>
      <div className="comment-card__text-zone">
        {isEditing ? (
          <textarea
            id="updateComment"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
            autoFocus
          />
        ) : (
          <p>{comment.text}</p>
        )}
      </div>
      <small>{new Date(comment.createdAt).toLocaleString()}</small>
    </div>
  );
};
