// Song can be added to a new playlist or selected playlist

import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";

const SongPage = () => {
  const { songid } = useParams();
  const { songs } = useContext(PlaylistContext);
  const song = songs.find((s) => s.id === parseInt(songid));

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  if (!song) {
    return (
      <>
        <NavBar />
        <div>Song not found</div>
      </>
    );
  }

  const handleLike = () => {
    setLiked(true);
    setDisliked(false);
    // Here you can add more logic, such as updating the song rating in the context or database
  };

  const handleDislike = () => {
    setDisliked(true);
    setLiked(false);
    // Here you can add more logic, such as updating the song rating in the context or database
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h1>{song.name}</h1>

        <div className="song-details">
          <h3>Artist: {song.artist}</h3>
          {song.album && (
            <p>
              <strong>Album:</strong> {song.album}
            </p>
          )}
          {song.genre && (
            <p>
              <strong>Genre:</strong> {song.genre}
            </p>
          )}
          {song.releaseDate && (
            <p>
              <strong>Release Date:</strong> {song.releaseDate}
            </p>
          )}
        </div>

        <SpotifyEmbed songLink={song.link} />

        <Link to={`/addtoplaylist/${song.id}`} className="btn btn-primary mt-3">
          Add to Playlist
        </Link>

        <div className="mt-3">
          <button
            className={`btn ${liked ? "btn-success" : "btn-outline-success"}`}
            onClick={handleLike}
          >
            {liked ? "Liked" : "Like"}
          </button>
          <button
            className={`btn ms-2 ${
              disliked ? "btn-danger" : "btn-outline-danger"
            }`}
            onClick={handleDislike}
          >
            {disliked ? "Disliked" : "Dislike"}
          </button>
        </div>

        <Link to="/songfeed" className="btn btn-secondary mt-3">
          Back to Song List
        </Link>
      </div>
    </>
  );
};

export default SongPage;
