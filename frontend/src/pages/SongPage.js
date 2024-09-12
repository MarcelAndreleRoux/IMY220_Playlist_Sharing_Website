// Song can be added to a new playlist or selected playlist

import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { SpotifyEmbed } from "../components/SpotifyEmbed";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { NavBar } from "../components/NavBar";

const SongPage = ({ songs, users }) => {
  const { songid } = useParams();
  const song = songs.find((s) => s.id === parseInt(songid));

  if (!song) {
    return <div>Song not found</div>;
  }

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

        <NavLink
          to={`/addtoplaylist/${song.id}`}
          className="btn btn-primary mt-3"
        >
          Add to Playlist
        </NavLink>

        <div className="mt-3">
          <button className="btn btn-success">Like</button>
          <button className="btn btn-danger ms-2">Dislike</button>
        </div>

        <NavLink to="/songfeed" className="btn btn-secondary mt-3">
          Back to Song List
        </NavLink>
      </div>
    </>
  );
};

export default SongPage;
