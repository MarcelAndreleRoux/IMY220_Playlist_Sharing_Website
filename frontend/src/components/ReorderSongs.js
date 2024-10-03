import React from "react";
import NoSongsMessage from "./NoSongsMessage";

const ReorderSongs = ({ playlistSongs, setPlaylistSongs, songs }) => {
  const handleRemoveSong = (songId) => {
    setPlaylistSongs(playlistSongs.filter((id) => id !== songId));
  };

  return (
    <>
      <h3>Reorder or Remove Songs</h3>
      {playlistSongs.length > 0 ? (
        <ul className="list-group mb-3">
          {playlistSongs.map((songId, index) => {
            const song = songs.find((s) => s.id === songId);
            return (
              <li
                key={songId}
                className="list-group-item d-flex justify-content-between"
              >
                <div>
                  <strong>
                    {index + 1}. {song?.name || "Unknown Song"}
                  </strong>{" "}
                  by {song?.artist || "Unknown Artist"}
                </div>

                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveSong(songId)}
                >
                  Remove
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

export default ReorderSongs;
