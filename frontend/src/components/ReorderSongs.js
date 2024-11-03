import React, { useContext } from "react";
import NoSongsMessage from "./NoSongsMessage";
import { PlaylistContext } from "../context/PlaylistContext";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

const ReorderSongs = ({
  playlistSongs,
  setPlaylistSongs,
  songs,
  playlistId,
}) => {
  const { removeSongFromPlaylist } = useContext(PlaylistContext);

  const handleRemoveSong = async (songId) => {
    await removeSongFromPlaylist(playlistId, songId);
    setPlaylistSongs((prevSongs) => prevSongs.filter((id) => id !== songId));
  };

  const moveSong = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= playlistSongs.length) return;

    setPlaylistSongs((prevSongs) => {
      const newSongs = [...prevSongs];
      const temp = newSongs[index];
      newSongs[index] = newSongs[newIndex];
      newSongs[newIndex] = temp;
      return newSongs;
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Reorder or Remove Songs</h3>
      {playlistSongs.length > 0 ? (
        <div className="space-y-2">
          {playlistSongs.map((songId, index) => {
            const song = songs.find((s) => s._id === songId);
            return (
              <div
                key={songId}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="flex-1">
                  <strong className="text-gray-900">
                    {index + 1}. {song?.name || "Unknown Song"}
                  </strong>
                  <span className="text-gray-500 ml-2">
                    by {song?.artist || "Unknown Artist"}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex flex-col mx-2">
                    <button
                      onClick={() => moveSong(index, "up")}
                      disabled={index === 0}
                      className={`p-1 hover:bg-gray-100 rounded ${
                        index === 0 ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <BsArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveSong(index, "down")}
                      disabled={index === playlistSongs.length - 1}
                      className={`p-1 hover:bg-gray-100 rounded ${
                        index === playlistSongs.length - 1
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      <BsArrowDown size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveSong(songId)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <NoSongsMessage />
      )}
    </div>
  );
};

export default ReorderSongs;
