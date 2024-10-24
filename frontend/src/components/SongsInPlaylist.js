import React from "react";
import NoSongsMessage from "./NoSongsMessage";

const SongsInPlaylist = ({ playlist, songs, removeSongFromPlaylist }) => {
  // Map song IDs from the playlist to actual song objects
  const playlistSongs = playlist.songs
    .map((songId) => songs.find((song) => song.id === songId))
    .filter((song) => song); // Filter out any undefined songs

  return (
    <>
      <h3>Songs in Playlist</h3>
      {playlistSongs.length > 0 ? (
        <ul className="list-group mb-5">
          {playlistSongs.map((song) => (
            <li
              key={song.id}
              className="list-group-item d-flex align-items-center"
            >
              <div className="flex-grow-1">
                <h5 className="mb-1">{song.name}</h5>
                <p className="mb-1 text-muted">by {song.artist}</p>
              </div>

              {song.link ? (
                <iframe
                  src={`https://open.spotify.com/embed/track/${
                    song.link.split("/track/")[1]
                  }`}
                  width="300"
                  height="80"
                  frameBorder="0"
                  allow="encrypted-media"
                  title={song.name}
                ></iframe>
              ) : (
                <p className="text-muted">No Spotify link available</p>
              )}

              <button
                className="btn btn-danger ms-3"
                onClick={() => removeSongFromPlaylist(song.id)}
              >
                Remove Song
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
