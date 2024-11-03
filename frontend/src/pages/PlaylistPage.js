import React, { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import CommentSection from "../components/CommentsSection";
import CommentPopup from "../components/CommentPopup";
import SongsInPlaylist from "../components/SongsInPlaylist";
import { PlaylistContext } from "../context/PlaylistContext";

const PlaylistPage = () => {
  const { playlistid } = useParams();
  const {
    playlists,
    users,
    songs,
    authenticatedUser,
    handleLikePlaylist,
    handleUnlikePlaylist,
    setPlaylists,
  } = useContext(PlaylistContext);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);

  const playlist = playlists.find((pl) => pl._id === playlistid) || {
    songs: [],
    followers: [],
    hashtags: [],
    comments: [],
  };

  const [playlistSongs, setPlaylistSongs] = useState(playlist.songs || []);

  const isCreator = authenticatedUser?.created_playlists?.includes(
    playlist._id
  );

  const isFollowing = authenticatedUser?.playlists?.includes(playlist._id);

  const handleAddComment = async (formData) => {
    try {
      const response = await fetch(`/api/playlists/${playlistid}/comment`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const updatedPlaylist = await response.json();
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl._id === playlistid ? updatedPlaylist.result : pl
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const updatedComments = playlist.comments.map((comment) => {
        if (comment._id === commentId) {
          const hasLiked = comment.likedBy?.includes(authenticatedUser._id);
          return {
            ...comment,
            likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
            likedBy: hasLiked
              ? comment.likedBy.filter((id) => id !== authenticatedUser._id)
              : [...(comment.likedBy || []), authenticatedUser._id],
          };
        }
        return comment;
      });

      const response = await fetch(`/api/playlists/${playlistid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: updatedComments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update comment likes");
      }

      const updatedPlaylist = await response.json();
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl._id === playlistid ? updatedPlaylist.result : pl
        )
      );
    } catch (error) {
      console.error("Error updating comment likes:", error);
    }
  };

  const handlePinComment = async (commentId) => {
    try {
      const updatedComments = playlist.comments.map((comment) => ({
        ...comment,
        isPinned: comment._id === commentId,
      }));

      const response = await fetch(`/api/playlists/${playlistid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: updatedComments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to pin comment");
      }

      const updatedPlaylist = await response.json();
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl._id === playlistid ? updatedPlaylist.result : pl
        )
      );
    } catch (error) {
      console.error("Error pinning comment:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="d-flex align-items-center mb-4">
          <img
            src={playlist.coverImage || "https://via.placeholder.com/150"}
            className="img-thumbnail"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
            alt="Cover"
          />
          <div className="ms-4">
            <h1>{playlist.name}</h1>
            <p className="text-muted">
              By{" "}
              {users.find((u) => u._id === playlist.creatorId)?.username ||
                "Unknown"}
            </p>
            <p>{playlist.genre}</p>
            <div>
              {playlist.hashtags?.map((tag, i) => (
                <span key={i} className="badge bg-secondary me-1">
                  #{tag}
                </span>
              ))}
            </div>
            <p>{(playlist.followers || []).length} Followers</p>
            <div className="mt-4">
              {isCreator ? (
                <Link to={`/edit_playlist/${playlist._id}`}>
                  <button className="btn btn-warning">Edit Playlist</button>
                </Link>
              ) : (
                <button
                  className={isFollowing ? "btn btn-danger" : "btn btn-success"}
                  onClick={() =>
                    isFollowing
                      ? handleUnlikePlaylist(playlist._id)
                      : handleLikePlaylist(playlist._id)
                  }
                >
                  {isFollowing ? "Unlike" : "Like"}
                </button>
              )}
            </div>
          </div>
        </div>

        <SongsInPlaylist
          playlist={{ ...playlist, songs: playlistSongs }}
          songs={songs}
          setPlaylistSongs={setPlaylistSongs}
        />

        <div className="mt-8">
          <button
            onClick={() => setIsCommentPopupOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Leave a Comment
          </button>

          <CommentSection
            comments={playlist.comments || []}
            onLikeComment={handleLikeComment}
            onPinComment={handlePinComment}
            currentUserId={authenticatedUser?._id}
            isPlaylistCreator={authenticatedUser?._id === playlist.creatorId}
          />
        </div>

        <CommentPopup
          isOpen={isCommentPopupOpen}
          onClose={() => setIsCommentPopupOpen(false)}
          onSubmit={handleAddComment}
        />
      </div>
    </>
  );
};

export default PlaylistPage;
