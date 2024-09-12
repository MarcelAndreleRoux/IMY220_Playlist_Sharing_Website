import React from "react";
import { useParams, Link } from "react-router-dom";
import DefaultPfP from "../../public/assets/images/profile_image_default.jpg";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { NavBar } from "../components/NavBar";

function PlaylistPage({ playlists, users, songs, removeSongFromPlaylist }) {
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

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-4">
            {playlist.coverImage ? (
              <img
                src={DefaultImage}
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
          </div>
        </div>

        <h3>Songs in Playlist</h3>
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

        <h3>Comments</h3>
        <div
          id="commentsCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {playlist.comments.length > 0 ? (
              playlist.comments.map((comment, index) => {
                const user = findUserById(comment.userId) || {
                  username: "Unknown User",
                  profilePic: DefaultPfP,
                };

                return (
                  <div
                    key={comment.id}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <div className="comment-card">
                      <img
                        src={user.profilePic || DefaultPfP}
                        alt={user.username}
                        width="50"
                        className="rounded-circle"
                      />
                      <Link to={`/profile/${user.id}`}>{user.username}</Link>
                      <p>
                        {comment.text.length > 100
                          ? `${comment.text.substring(0, 100)}...`
                          : comment.text}
                      </p>
                      <p>{comment.stars} Stars</p>
                      <button className="btn btn-sm btn-outline-primary">
                        Like
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        Dislike
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="carousel-item active">
                <p>No comments yet.</p>
              </div>
            )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#commentsCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#commentsCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default PlaylistPage;
