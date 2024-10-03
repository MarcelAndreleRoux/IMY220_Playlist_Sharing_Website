import React from "react";
import { Link } from "react-router-dom";
import DefaultPfP from "../../public/assets/images/profile_image_default.jpg";

const CommentsSection = ({
  playlist,
  findUserById,
  updatePlaylistComments,
}) => {
  const handleLikeDislikeToggle = (commentId) => {
    const updatedComments = playlist.comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likedByUser ? comment.likes - 1 : comment.likes + 1,
          likedByUser: !comment.likedByUser, // Toggle like status
        };
      }
      return comment;
    });

    updatePlaylistComments(playlist.id, updatedComments);
  };

  return (
    <>
      <h3>Comments</h3>
      <div className="row">
        {playlist.comments && playlist.comments.length > 0 ? (
          playlist.comments.map((comment) => {
            const user = findUserById(comment.userId) || {
              username: "Unknown User",
              profilePic: DefaultPfP,
            };

            const isLiked = comment.likedByUser;

            return (
              <div key={comment.id} className="col-md-4 mb-4">
                <div className="comment-card p-3 h-100">
                  <img
                    src={user.profilePic || DefaultPfP}
                    alt={user.username}
                    width="50"
                    className="rounded-circle mb-2"
                  />
                  <Link to={`/profile/${user.id}`}>{user.username}</Link>
                  <p>{comment.text}</p>
                  <p>{comment.stars} Stars</p>
                  <button
                    className={`btn btn-sm ${
                      isLiked ? "btn-outline-danger" : "btn-outline-primary"
                    }`}
                    onClick={() => handleLikeDislikeToggle(comment.id)}
                  >
                    {isLiked ? "Dislike Comment" : "Like Comment"}
                  </button>
                  <p>{comment.likes || 0} Likes</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </>
  );
};

export default CommentsSection;
