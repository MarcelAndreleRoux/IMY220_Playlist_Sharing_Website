import React, { useContext } from "react";
import NoSongsMessage from "./NoSongsMessage";
import SpotifyEmbed from "./SpotifyEmbed";
import { PlaylistContext } from "../context/PlaylistContext";
import { Link } from "react-router-dom";
import { BsTrash, BsPlusLg } from "react-icons/bs"; // We'll need to install react-icons

const SongsInPlaylist = ({ playlist, songs, setPlaylistSongs }) => {
  const { removeSongFromPlaylist } = useContext(PlaylistContext);

  const playlistSongs = (playlist.songs || [])
    .map((songId) => songs.find((song) => song._id === songId))
    .filter((song) => song);

  const handleRemoveSong = async (songId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this song from the playlist?"
      )
    ) {
      try {
        await removeSongFromPlaylist(playlist._id, songId);
        const updatedSongs = playlist.songs.filter((id) => id !== songId);
        setPlaylistSongs(updatedSongs);
      } catch (error) {
        console.error("Error removing song:", error);
        alert("Failed to remove song from playlist");
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">Songs in Playlist</h3>
      {playlistSongs.length > 0 ? (
        <div className="space-y-4">
          {playlistSongs.map((song) => (
            <div
              key={song._id}
              className={`bg-white rounded-lg shadow-sm p-4 ${
                song.isDeleted ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-x-4">
                    <div className="flex-1">
                      <a
                        href={song.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {song.name}
                        {song.isDeleted && (
                          <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Deleted
                          </span>
                        )}
                      </a>
                      <p className="text-gray-500">{song.artist}</p>
                    </div>

                    <div className="flex items-center gap-x-2">
                      <Link
                        to={`/addtoplaylist/${song._id}`}
                        className="p-2 bg-green-700 text-white rounded-md hover:bg-green-500 transition-colors"
                        title="Add to Other Playlist"
                      >
                        <BsPlusLg size={16} />
                      </Link>
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        className="p-2 bg-red-700 text-white rounded-md hover:bg-red-400 transition-colors"
                        title="Remove from Playlist"
                      >
                        <BsTrash size={16} />
                      </button>
                    </div>
                  </div>

                  {!song.isDeleted ? (
                    <div className="mt-4">
                      <SpotifyEmbed songLink={song.link} />
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-500 italic">
                      Song no longer available
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoSongsMessage />
      )}
    </div>
  );
};

export default SongsInPlaylist;
