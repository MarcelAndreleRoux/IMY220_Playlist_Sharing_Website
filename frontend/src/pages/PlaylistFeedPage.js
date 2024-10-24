import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistCard from "../components/PlaylistCard";
import SearchBar from "../components/SreachBar";
import AddPlaylistButton from "../components/AddPlaylistButton";

const PlaylistFeed = () => {
  const { playlists, users, setUsers } = useContext(PlaylistContext);

  const authenticatedUser = JSON.parse(
    localStorage.getItem("authenticatedUser")
  );
  const currentUser = users.find(
    (user) => user.username === authenticatedUser?.username
  );

  const [filteredPlaylists, setFilteredPlaylists] = useState(playlists);

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filteredPlaylists = playlists.filter((playlist) => {
      const playlistNameMatch = playlist.name
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      const hashtagsMatch = playlist.hashtags
        ?.join(", ")
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      const creator = users.find((user) => user.userId === playlist.creatorId);
      const creatorNameMatch = creator?.username
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);

      return playlistNameMatch || hashtagsMatch || creatorNameMatch;
    });
    setFilteredPlaylists(filteredPlaylists);
  };

  const handleFastAdd = (playlist) => {
    if (currentUser) {
      const alreadyInPlaylists = currentUser.playlists.includes(playlist.id);
      if (!alreadyInPlaylists) {
        const updatedUser = {
          ...currentUser,
          playlists: [...currentUser.playlists, playlist.id],
        };
        const updatedUsers = users.map((user) =>
          user.username === authenticatedUser?.username ? updatedUser : user
        );
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } else {
        alert("Playlist is already in your personal playlists.");
      }
    } else {
      alert("User not found.");
    }
  };

  const handleRemovePlaylist = (playlistId) => {
    const updatedUser = {
      ...currentUser,
      playlists: currentUser.playlists.filter((id) => id !== playlistId),
    };

    const updatedUsers = users.map((user) =>
      user.username === authenticatedUser?.username ? updatedUser : user
    );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <SearchBar onSearch={handleSearch} placeholder="Search Playlists..." />
        <div className="row">
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                currentUser={currentUser}
                handleFastAdd={handleFastAdd}
                handleRemovePlaylist={handleRemovePlaylist}
                isCreatedPlaylist={currentUser?.created_playlists.includes(
                  playlist.id
                )}
              />
            ))
          ) : (
            <div>No Playlist Found.</div>
          )}
        </div>
      </div>
      <AddPlaylistButton />
    </>
  );
};

export default PlaylistFeed;
