import React, { useContext, useState, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SreachBar";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";
import PlaylistCard from "../components/PlaylistCard";

export const HomePage = () => {
  const { playlists, songs, users, authenticatedUser } =
    useContext(PlaylistContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "songs"
  );

  const [filteredResults, setFilteredResults] = useState({
    songs: [],
    playlists: [],
  });

  useEffect(() => {
    setFilteredResults({
      songs: songs,
      playlists: getFilteredPlaylists(),
    });
  }, [
    songs,
    playlists,
    authenticatedUser?.friends,
    authenticatedUser?.playlists,
  ]);

  // Get current user's friends
  const userFriends = authenticatedUser ? authenticatedUser.friends || [] : [];

  // Filter playlists to only show those from friends and followed playlists
  const friendsPlaylists = playlists.filter((playlist) => {
    const isCreatedByFriend = userFriends.includes(playlist.creatorId);
    const isFollowedByUser = authenticatedUser?.playlists?.includes(
      playlist.id
    );
    return isCreatedByFriend || isFollowedByUser;
  });

  const getFilteredPlaylists = () => {
    if (!authenticatedUser) return [];

    return playlists.filter((playlist) => {
      const isCreatedByFriend = authenticatedUser.friends?.includes(
        playlist.creatorId
      );
      const isFollowedByUser = authenticatedUser.playlists?.includes(
        playlist._id
      );
      const isCreatedByUser = authenticatedUser.created_playlists?.includes(
        playlist._id
      );

      return isCreatedByFriend || isFollowedByUser || isCreatedByUser;
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSearch = (searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();

    if (activeTab === "songs") {
      const filteredSongs = songs.filter(
        (song) =>
          song.name.toLowerCase().includes(lowercasedTerm) ||
          song.artist.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredResults((prev) => ({ ...prev, songs: filteredSongs }));
    } else {
      const filteredPlaylists = getFilteredPlaylists().filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(lowercasedTerm) ||
          playlist.hashtags?.some((tag) =>
            tag.toLowerCase().includes(lowercasedTerm)
          )
      );
      setFilteredResults((prev) => ({ ...prev, playlists: filteredPlaylists }));
    }
  };

  const playlistsFeedDescription =
    "Activity from friends and followed playlists";

  return (
    <>
      <NavBar />
      <div className="container mt-5 no-underline">
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder={`Search ${
              activeTab === "songs" ? "Songs" : "Playlists"
            }...`}
            className="p-4 bg-amber-400 rounded-md shadow-md"
          />
        </div>

        <div className="flex mb-4">
          <button
            className={`flex-grow p-2 rounded-l-md ${
              activeTab === "songs"
                ? "bg-yellow-700 text-white"
                : "bg-amber-400 text-gray-900"
            }`}
            onClick={() => handleTabChange("songs")}
          >
            Songs Feed
          </button>
          <button
            className={`flex-grow p-2 rounded-r-md ${
              activeTab === "playlists"
                ? "bg-yellow-700 text-white"
                : "bg-amber-400 text-gray-900"
            }`}
            onClick={() => handleTabChange("playlists")}
          >
            Friends' Activity
          </button>
        </div>

        {activeTab === "playlists" && (
          <p className="text-muted mb-4">{playlistsFeedDescription}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "songs"
            ? filteredResults.songs.map((song) => (
                <div
                  key={song._id || `song-${song.link}`}
                  className={`p-4 rounded-lg shadow-md ${
                    song.isDeleted ? "bg-gray-100 border-red-400" : "bg-white"
                  }`}
                >
                  <h5
                    className={`text-lg font-semibold ${
                      song.isDeleted ? "text-gray-400" : "text-black"
                    }`}
                  >
                    {song.name}
                    {song.isDeleted && (
                      <span className="ml-2 text-red-500 font-medium">
                        (Deleted)
                      </span>
                    )}
                  </h5>
                  <p className="text-gray-500">{song.artist}</p>
                  {song.link && <SpotifyEmbed songLink={song.link} />}
                  <p className="mt-2 text-gray-600">
                    Added by:{" "}
                    {users.find((u) => u._id === song.creatorId)?.username ||
                      "Unknown"}
                  </p>
                  <p className="text-gray-600">
                    Added to {song.addedToPlaylistsCount || 0} playlists
                  </p>
                  <div className="mt-4 flex space-x-2">
                    <Link
                      to={`/song/${song._id}`}
                      className="px-3 py-1 bg-gray-200 text-gray-800 hover:text-gray-200 hover:bg-gray-800 rounded no-underline"
                    >
                      View Details
                    </Link>
                    {!song.isDeleted && (
                      <Link
                        to={`/addtoplaylist/${song._id}`}
                        className="px-3 py-1 bg-yellow-900 hover:bg-yellow-700 hover:text-gray-200 text-white rounded no-underline"
                      >
                        Add to Playlist
                      </Link>
                    )}
                  </div>
                </div>
              ))
            : filteredResults.playlists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))}
        </div>

        <Link to="/addsong" className="add-song-btn">
          Add Song
        </Link>
      </div>

      <style>{`
        .add-song-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 15px 20px;
          border-radius: 50px;
          text-align: center;
          font-size: 18px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          text-decoration: none;
        }
        .add-song-btn:hover {
          background-color: #218838;
          color: white;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};
