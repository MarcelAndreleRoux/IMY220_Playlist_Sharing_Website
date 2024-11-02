import React, { useContext, useState } from "react";
import NavBar from "../components/NavBar";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistCard from "../components/PlaylistCard";
import SearchBar from "../components/SreachBar";
import AddPlaylistButton from "../components/AddPlaylistButton";

const PlaylistFeed = () => {
  const { playlists, users, setUsers } = useContext(PlaylistContext);
  const authenticatedUser = JSON.parse(
    sessionStorage.getItem("authenticatedUser")
  );
  const currentUser = users.find(
    (user) => user.username === authenticatedUser?.username
  );

  const [filteredPlaylists, setFilteredPlaylists] = useState(playlists);
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'popular', 'name'

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
      const genreMatch = playlist.genre
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);
      const creator = users.find((user) => user.userId === playlist.creatorId);
      const creatorNameMatch = creator?.username
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);

      return (
        playlistNameMatch || hashtagsMatch || creatorNameMatch || genreMatch
      );
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

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    let sortedPlaylists = [...filteredPlaylists];

    switch (sortType) {
      case "recent":
        sortedPlaylists.sort(
          (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
        );
        break;
      case "popular":
        sortedPlaylists.sort(
          (a, b) => (b.followers?.length || 0) - (a.followers?.length || 0)
        );
        break;
      case "name":
        sortedPlaylists.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredPlaylists(sortedPlaylists);
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h1>Explore Playlists</h1>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, hashtag, or genre..."
          />
          <div className="btn-group">
            <button
              className={`btn btn-outline-primary ${
                sortBy === "recent" ? "active" : ""
              }`}
              onClick={() => handleSortChange("recent")}
            >
              Most Recent
            </button>
            <button
              className={`btn btn-outline-primary ${
                sortBy === "popular" ? "active" : ""
              }`}
              onClick={() => handleSortChange("popular")}
            >
              Most Popular
            </button>
            <button
              className={`btn btn-outline-primary ${
                sortBy === "name" ? "active" : ""
              }`}
              onClick={() => handleSortChange("name")}
            >
              A-Z
            </button>
          </div>
        </div>

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
            <div className="col-12 text-center">
              <p className="text-muted">
                No playlists found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
      <AddPlaylistButton />
    </>
  );
};

export default PlaylistFeed;
