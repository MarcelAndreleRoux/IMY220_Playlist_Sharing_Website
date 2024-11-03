import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistCard from "../components/PlaylistCard";
import { Link } from "react-router-dom";

const PersonalPlaylists = (handleRemovePlaylist) => {
  const { users, playlists, setUsers, authenticatedUser } =
    useContext(PlaylistContext);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [createdPlaylists, setCreatedPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = users.find((user) => user._id === authenticatedUser?._id);
  const isOwnProfile = authenticatedUser?._id === currentUser?._id;

  useEffect(() => {
    if (!currentUser) return;

    try {
      const createdPlaylistsData = playlists.filter((playlist) =>
        currentUser.created_playlists?.includes(playlist._id)
      );

      const likedPlaylistsData = playlists.filter(
        (playlist) =>
          currentUser.playlists?.includes(playlist._id) &&
          !currentUser.created_playlists?.includes(playlist._id)
      );

      setCreatedPlaylists(createdPlaylistsData);
      setLikedPlaylists(likedPlaylistsData);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [currentUser, playlists, authenticatedUser]);

  if (error) {
    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="alert alert-danger">Error: {error}</div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="alert alert-warning">User not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto mt-5">
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">
          My Playlists
        </h1>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-orange-500">
              Created Playlists
            </h2>
            <Link
              to="/create_playlist"
              className="text-blue-500 hover:underline"
            >
              Create New Playlist
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdPlaylists.length > 0 ? (
              createdPlaylists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-3">
                You haven't created any playlists yet.
              </p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-orange-500 mb-4">
            Saved Playlists
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedPlaylists.length > 0 ? (
              likedPlaylists.map((playlist) => (
                <PlaylistCard key={playlist._id} playlist={playlist} />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-3">
                You haven't saved any playlists yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalPlaylists;
