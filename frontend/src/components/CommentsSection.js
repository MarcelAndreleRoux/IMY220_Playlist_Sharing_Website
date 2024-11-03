import React, { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";

const CommentSection = ({
  comments,
  onLikeComment,
  onPinComment,
  currentUserId,
  isPlaylistCreator,
}) => {
  const [visibleComments, setVisibleComments] = useState(5);

  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const showMoreComments = () => {
    setVisibleComments((prev) => prev + 5);
  };

  return (
    <div className="mt-8 mb-16">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>
      <div className="space-y-4">
        {sortedComments.slice(0, visibleComments).map((comment, index) => (
          <div
            key={comment._id || index}
            className={`p-4 rounded-lg border ${
              comment.isPinned ? "bg-gray-50 border-blue-200" : "bg-white"
            }`}
          >
            {comment.isPinned && (
              <div className="text-sm text-blue-600 mb-2 flex items-center gap-2">
                <BsPinAngleFill size={16} />
                <span>Pinned Comment</span>
              </div>
            )}

            <div className="flex items-start gap-4">
              <img
                src={comment.authorPic || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{comment.authorName}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-2">{comment.text}</p>

                {comment.image && (
                  <div className="mt-2 max-w-lg">
                    <img
                      src={comment.image}
                      alt="Comment attachment"
                      className="rounded w-full h-auto object-cover"
                      style={{ maxHeight: "300px" }}
                    />
                  </div>
                )}

                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => onLikeComment(comment._id)}
                    className={`flex items-center gap-1 ${
                      comment.likedBy?.includes(currentUserId)
                        ? "text-blue-600"
                        : "text-gray-500"
                    } hover:text-blue-600 transition-colors duration-200`}
                  >
                    {comment.likedBy?.includes(currentUserId) ? (
                      <AiFillLike size={20} />
                    ) : (
                      <AiOutlineLike size={20} />
                    )}
                    <span>{comment.likes}</span>
                  </button>

                  {isPlaylistCreator && !comment.isPinned && (
                    <button
                      onClick={() => onPinComment(comment._id)}
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                    >
                      <BsPinAngle size={16} />
                      <span>Pin</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {comments.length > visibleComments && (
        <button
          onClick={showMoreComments}
          className="mt-4 w-full py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
        >
          Show More Comments
        </button>
      )}
    </div>
  );
};

export default CommentSection;
