import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import DefaultPfP from "../../public/assets/images/profile_image_default.jpg";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { NavBar } from "../components/NavBar";

function PlaylistPage({
  playlists,
  users,
  songs,
  removeSongFromPlaylist,
  updatePlaylistComments,
}) {
  const { playlistid } = useParams();
  const playlist = playlists.find((pl) => pl.id === parseInt(playlistid));

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  // Helper function to find a user by their ID
  const findUserById = (id) => users.find((user) => user.id === id);

  // Helper function to find a song by its ID
  const findSongById = (songId) => songs.find((song) => song.id === songId);

  // Handle song removal
  const handleRemoveSong = (songId) => {
    removeSongFromPlaylist(playlist.id, songId);
  };

  // Format date
  const formattedDate = new Date(playlist.creationDate).toLocaleDateString();

  // Handle like/dislike toggle
  const handleLikeDislikeToggle = (commentId) => {
    const updatedComments = playlist.comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.likedByUser ? comment.likes - 1 : comment.likes + 1,
          likedByUser: !comment.likedByUser, // Toggle the like status
        };
      }
      return comment;
    });

    // Call the parent function to update the playlist comments
    updatePlaylistComments(playlist.id, updatedComments);
  };

  const userId = parseInt(localStorage.getItem("userId"), 10); // Ensure userId is a number

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-4">
            {playlist.coverImage ? (
              <img
                src={playlist.coverImage || DefaultImage}
                alt="Playlist Cover"
                className="img-fluid mb-4"
              />
            ) : (
              <img
                src={DefaultImage}
                alt="Default Playlist Cover"
                className="img-fluid mb-4"
              />
            )}
          </div>
          <div className="col">
            <h1>{playlist.name}</h1>
            <p>{playlist.description}</p>
            {playlist.hashtags && playlist.hashtags.length > 0 && (
              <div>
                <strong>Hashtags: </strong>
                {playlist.hashtags.map((hashtag, index) => (
                  <span key={index} className="badge bg-secondary me-1">
                    {hashtag}
                  </span>
                ))}
              </div>
            )}
            <p>
              <strong>Created on: </strong>
              {formattedDate}
            </p>
          </div>
          <div className="col">
            {playlist.creatorId === userId && (
              <Link
                to={`/edit_playlist/${playlist.id}`}
                className="btn btn-primary"
              >
                Edit Playlist
              </Link>
            )}
          </div>
        </div>

        <h3>Songs in Playlist</h3>
        {playlist.songs && playlist.songs.length > 0 ? (
          <ul className="list-group mb-5">
            {playlist.songs.map((songId) => {
              const song = findSongById(songId);
              if (!song) {
                return (
                  <li key={songId} className="list-group-item">
                    <p>Song not found</p>
                  </li>
                );
              }

              return (
                <li key={songId} className="list-group-item">
                  <iframe
                    src={`https://open.spotify.com/embed/track/${
                      song.link.split("/track/")[1]
                    }`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="encrypted-media"
                    title={song.name}
                  ></iframe>

                  <p>
                    {song.name} by {song.artist}
                  </p>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveSong(songId)}
                  >
                    Remove Song
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No songs yet.</p>
        )}

        <div className="button">
          <Link to="/songfeed">
            <button className="add-songs-btn">Add Songs</button>
          </Link>
        </div>

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

        <Link to={`/addcomment/${playlist.id}`} className="add-comment-btn">
          Add a Comment
        </Link>
      </div>

      <style jsx="true">{`
        .comment-card {
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
          height: 100%;
        }

        .add-songs-btn {
          position: fixed;
          bottom: 100px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 15px 20px;
          border-radius: 50px;
          text-align: center;
          font-size: 18px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }

        .add-songs-btn:hover {
          background-color: #218838;
          text-decoration: none;
        }

        .add-comment-btn {
          position: fixed;
          right: 20px;
          bottom: 20px;
          background-color: #007bff;
          color: white;
          padding: 15px 20px;
          border-radius: 50px;
          font-size: 18px;
          text-align: center;
          z-index: 1000;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        }

        .add-comment-btn:hover {
          background-color: #0056b3;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}

export default PlaylistPage;
