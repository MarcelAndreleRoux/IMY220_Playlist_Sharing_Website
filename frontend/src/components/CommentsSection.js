import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import DefaultPfP from "../../public/assets/images/profile_image_default.jpg";

const CommentsSection = ({
  playlist,
  findUserById,
  updatePlaylistComments,
  currentUser,
}) => {
  const [commentsToShow, setCommentsToShow] = useState(5);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentImage, setNewCommentImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleLikeDislikeToggle = (commentId) => {
    const updatedComments = playlist.comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likedByUser ? comment.likes - 1 : comment.likes + 1,
          likedByUser: !comment.likedByUser,
        };
      }
      return comment;
    });
    updatePlaylistComments(playlist.id, updatedComments);
  };

  const handlePinComment = (commentId) => {
    const updatedComments = playlist.comments.map((comment) => ({
      ...comment,
      pinned: comment.id === commentId,
    }));
    updatePlaylistComments(playlist.id, updatedComments);
  };

  const handleAddComment = () => {
    const newComment = {
      id: playlist.comments.length + 1,
      userId: currentUser.userId,
      text: newCommentText,
      image: newCommentImage,
      likes: 0,
      stars: 0,
      pinned: false,
    };

    const updatedComments = [...playlist.comments, newComment];
    updatePlaylistComments(playlist.id, updatedComments);
    setNewCommentText("");
    setNewCommentImage(null);
  };

  const loadMoreComments = () => {
    setCommentsToShow((prev) => prev + 5);
  };

  const pinnedComment = playlist.comments.find((comment) => comment.pinned);

  return (
    <>
      <h3>Comments</h3>
      {pinnedComment && (
        <div className="pinned-comment alert alert-info">
          <strong>Pinned:</strong>
          <p>{pinnedComment.text}</p>
          <p>{pinnedComment.likes} Likes</p>
        </div>
      )}

      <div className="row">
        {playlist.comments.slice(0, commentsToShow).map((comment) => {
          const user = findUserById(comment.userId) || {
            username: "Unknown User",
            profilePic: DefaultPfP,
          };

          return (
            <div key={comment.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={user.profilePic || DefaultPfP}
                      alt={user.username}
                      width="50"
                      className="rounded-circle me-2"
                    />
                    <Link to={`/profile/${user.userId}`}>{user.username}</Link>
                  </div>
                  <p>{comment.text}</p>
                  {comment.image && (
                    <img
                      src={comment.image}
                      alt="Comment Attachment"
                      className="img-fluid"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {playlist.comments.length > commentsToShow && (
        <button className="btn btn-secondary mt-3" onClick={loadMoreComments}>
          Load More Comments
        </button>
      )}

      <textarea
        className="form-control mb-2"
        placeholder="Write your comment..."
        value={newCommentText}
        onChange={(e) => setNewCommentText(e.target.value)}
      />
      <input
        type="file"
        className="form-control mb-2"
        ref={fileInputRef}
        onChange={(e) =>
          setNewCommentImage(URL.createObjectURL(e.target.files[0]))
        }
      />
      <button className="btn btn-primary" onClick={handleAddComment}>
        Post Comment
      </button>
    </>
  );
};

export default CommentsSection;
