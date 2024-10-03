import React from "react";
import NoSongsMessage from "./NoSongsMessage";

const SongsInPlaylist = ({ songs, removeSongFromPlaylist }) => {
  return (
    <>
      <h3>Songs in Playlist</h3>
      {songs && songs.length > 0 ? (
        <ul className="list-group mb-5">
          {songs.map((song) => {
            if (!song) {
              return (
                <li key={song.id} className="list-group-item">
                  <p>Song not found</p>
                </li>
              );
            }

            return (
              <li key={song.id} className="list-group-item">
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
                  onClick={() => removeSongFromPlaylist(song.id)}
                >
                  Remove Song
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <NoSongsMessage />
      )}
    </>
  );
};

export default SongsInPlaylist;
