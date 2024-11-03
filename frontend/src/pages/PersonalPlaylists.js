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
      <div className="container mt-5">
        <h1 className="mb-4">
          {isOwnProfile
            ? "My Playlists"
            : `${currentUser?.username}'s Playlists`}
        </h1>

        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Created Playlists</h2>
            <Link to="/create_playlist" className="btn btn-primary">
              Create New Playlist
            </Link>
          </div>

          {createdPlaylists.length > 0 ? (
            <div className="row">
              {createdPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  currentUser={currentUser}
                  isCreatedPlaylist={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-4">
              You haven't created any playlists yet
            </p>
          )}
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Saved Playlists</h2>
            <Link to="/playlistfeed" className="btn btn-success">
              Explore Playlists
            </Link>
          </div>

          {likedPlaylists.length > 0 ? (
            <div className="row">
              {likedPlaylists.map((playlist) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  currentUser={currentUser}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted text-center py-4">
              You haven't saved any playlists yet
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalPlaylists;
