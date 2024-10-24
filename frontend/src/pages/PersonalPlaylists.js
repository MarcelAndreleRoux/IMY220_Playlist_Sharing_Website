import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistCard from "../components/PlaylistCard";
import NoPlaylistsMessage from "../components/NoPlaylistsMessage";

const PersonalPlaylists = () => {
  const { username } = useParams();
  const { users, playlists, setUsers } = useContext(PlaylistContext);

  const [likedPlaylists, setLikedPlaylists] = useState([]);
  const [createdPlaylists, setCreatedPlaylists] = useState([]);

  const currentUser = users.find((user) => user.username === username);

  useEffect(() => {
    if (currentUser) {
      const created = playlists.filter((playlist) =>
        currentUser.created_playlists.includes(playlist.id)
      );

      // Filter out playlists that are both liked and created
      const liked = playlists.filter(
        (playlist) =>
          currentUser.playlists.includes(playlist.id) &&
          !currentUser.created_playlists.includes(playlist.id)
      );

      setLikedPlaylists(liked);
      setCreatedPlaylists(created);
    }
  }, [currentUser, playlists]);

  const handleRemovePlaylist = (playlistId) => {
    const updatedUser = {
      ...currentUser,
      playlists: currentUser.playlists.filter((id) => id !== playlistId),
    };

    const updatedUsers = users.map((user) =>
      user.username === username ? updatedUser : user
    );

    setUsers(updatedUsers);
    sessionStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  if (
    !currentUser ||
    (likedPlaylists.length === 0 && createdPlaylists.length === 0)
  ) {
    return (
      <>
        <NavBar />
        <NoPlaylistsMessage message="No Playlists Found." />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h2>{currentUser.username}'s Playlists</h2>

        <div className="row">
          <h3>Liked Playlists</h3>
          {likedPlaylists.length > 0 ? (
            likedPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                currentUser={currentUser}
                handleRemovePlaylist={handleRemovePlaylist}
              />
            ))
          ) : (
            <NoPlaylistsMessage message="No Liked Playlists Found." />
          )}
        </div>

        <div className="row mt-5">
          <h3>Created Playlists</h3>
          {createdPlaylists.length > 0 ? (
            createdPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                currentUser={currentUser}
                isCreatedPlaylist={true}
              />
            ))
          ) : (
            <NoPlaylistsMessage
              message="No Created Playlists Found."
              linkText="Create Playlists"
              linkTo="/create_playlist"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PersonalPlaylists;
