import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistCard from "../components/PlaylistCard";
import NoPlaylistsMessage from "../components/NoPlaylistsMessage";

const PersonalPlaylists = () => {
  const { username } = useParams();
  const { users, playlists, setUsers, authenticatedUser } =
    useContext(PlaylistContext);
  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [createdPlaylists, setCreatedPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user's profile
  const currentUser = users.find((user) => user.username === username);
  const isOwnProfile = authenticatedUser?.userId === currentUser?.userId;

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        // Fetch created playlists
        const createdPlaylistsData = await Promise.all(
          currentUser.created_playlists.map(async (playlistId) => {
            const response = await fetch(`/api/playlists/${playlistId}`);
            if (!response.ok)
              throw new Error(`Failed to fetch playlist ${playlistId}`);
            return response.json();
          })
        );

        // Fetch liked/saved playlists (ones in playlists array but not in created_playlists)
        const likedPlaylistIds = currentUser.playlists.filter(
          (id) => !currentUser.created_playlists.includes(id)
        );

        const likedPlaylistsData = await Promise.all(
          likedPlaylistIds.map(async (playlistId) => {
            const response = await fetch(`/api/playlists/${playlistId}`);
            if (!response.ok)
              throw new Error(`Failed to fetch playlist ${playlistId}`);
            return response.json();
          })
        );

        setCreatedPlaylists(createdPlaylistsData);
        setLikedPlaylists(likedPlaylistsData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching playlists:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, [currentUser]);

  const handleRemovePlaylist = async (playlistId) => {
    try {
      // Remove playlist from user's playlists array
      const updatedPlaylists = currentUser.playlists.filter(
        (id) => id !== playlistId
      );

      const response = await fetch(`/api/users/${currentUser.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlists: updatedPlaylists,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user playlists");
      }

      // Update local state
      const updatedUser = {
        ...currentUser,
        playlists: updatedPlaylists,
      };

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === currentUser.userId ? updatedUser : user
        )
      );

      // Remove from liked playlists display
      setLikedPlaylists((prev) =>
        prev.filter((playlist) => playlist.id !== playlistId)
      );
    } catch (err) {
      setError(err.message);
      console.error("Error removing playlist:", err);
    }
  };

  if (isLoading) {
    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="text-center">Loading...</div>
        </div>
      </>
    );
  }

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
        <h2>
          {isOwnProfile
            ? "My Playlists"
            : `${currentUser.username}'s Playlists`}
        </h2>

        {isOwnProfile && (
          <Link to="/create_playlist" className="btn btn-primary mb-4">
            Create New Playlist
          </Link>
        )}

        <div className="row mb-5">
          <h3>Created Playlists</h3>
          {createdPlaylists.length > 0 ? (
            createdPlaylists.map((playlist) => (
              <div key={playlist.id} className="col-md-4 mb-4">
                <PlaylistCard
                  playlist={playlist}
                  currentUser={currentUser}
                  isCreatedPlaylist={true}
                  authenticatedUser={authenticatedUser}
                />
              </div>
            ))
          ) : (
            <NoPlaylistsMessage
              message={
                isOwnProfile
                  ? "You haven't created any playlists yet."
                  : "No playlists created yet."
              }
              showCreateLink={isOwnProfile}
            />
          )}
        </div>

        <div className="row">
          <h3>Saved Playlists</h3>
          {likedPlaylists.length > 0 ? (
            likedPlaylists.map((playlist) => (
              <div key={playlist.id} className="col-md-4 mb-4">
                <PlaylistCard
                  playlist={playlist}
                  currentUser={currentUser}
                  handleRemovePlaylist={handleRemovePlaylist}
                  authenticatedUser={authenticatedUser}
                />
              </div>
            ))
          ) : (
            <NoPlaylistsMessage
              message={
                isOwnProfile
                  ? "You haven't saved any playlists yet."
                  : "No saved playlists yet."
              }
              showExploreLink={isOwnProfile}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalPlaylists;
