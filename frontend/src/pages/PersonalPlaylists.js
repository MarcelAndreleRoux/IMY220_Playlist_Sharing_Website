import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistCard from "../components/PlaylistCard";
import NoPlaylistsMessage from "../components/NoPlaylistsMessage";

const PersonalPlaylists = () => {
  const { username } = useParams();
  const { users, playlists, setUsers } = useContext(PlaylistContext);
  const [userPlaylists, setUserPlaylists] = useState([]);

  const currentUser = users.find((user) => user.username === username);

  useEffect(() => {
    if (currentUser) {
      const filteredPlaylists = playlists.filter((playlist) =>
        currentUser.playlists.includes(playlist.id)
      );
      setUserPlaylists(filteredPlaylists);
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

  if (!currentUser || userPlaylists.length === 0) {
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
          {userPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              handleRemovePlaylist={handleRemovePlaylist}
              isPersonalView={true}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonalPlaylists;
