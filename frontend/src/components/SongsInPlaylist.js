import React from "react";
import NoSongsMessage from "./NoSongsMessage";
import SpotifyEmbed from "./SpotifyEmbed";

const SongsInPlaylist = ({ playlist, songs, removeSongFromPlaylist }) => {
  // Map song IDs from the playlist to actual song objects
  const playlistSongs = (playlist.songs || [])
    .map((songId) => songs.find((song) => song.id === songId))
    .filter((song) => song); // Filter out undefined songs

  const handleRemoveSong = async (songId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this song from the playlist?"
      )
    ) {
      await removeSongFromPlaylist(songId);
    }
  };

  return (
    <>
      <h3>Songs in Playlist</h3>
      {playlistSongs.length > 0 ? (
        <ul className="list-group mb-5">
          {playlistSongs.map((song) => (
            <li
              key={song.id}
              className={`list-group-item d-flex align-items-center ${
                song.isDeleted ? "bg-light" : ""
              }`}
            >
              <div className="flex-grow-1">
                <h5 className="mb-1">
                  {song.name}
                  {song.isDeleted && (
                    <span className="badge bg-secondary ms-2">Deleted</span>
                  )}
                </h5>
                <p className="mb-1 text-muted">by {song.artist}</p>
              </div>

              {!song.isDeleted ? (
                <SpotifyEmbed songLink={song.link} />
              ) : (
                <p className="text-muted">Song no longer available</p>
              )}

              <button
                className="btn btn-danger ms-3"
                onClick={() => handleRemoveSong(song.id)}
              >
                Remove from Playlist
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <NoSongsMessage />
      )}
    </>
  );
};

export default SongsInPlaylist;
