import React, { useContext, useState, useEffect } from "react";
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
  const [sortBy, setSortBy] = useState("recent");

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

  const handleFastAdd = async (playlist) => {
    if (!authenticatedUser) {
      alert("Please log in to save playlists");
      return;
    }

    if (authenticatedUser.created_playlists.includes(playlist._id)) {
      return;
    }

    try {
      const updatedUser = {
        ...authenticatedUser,
        playlists: [...authenticatedUser.playlists, playlist._id],
      };

      const response = await fetch(`/api/users/${authenticatedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlists: updatedUser.playlists,
        }),
      });

      if (!response.ok) throw new Error("Failed to save playlist");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === authenticatedUser._id ? updatedUser : user
        )
      );
      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error saving playlist:", error);
      alert("Failed to save playlist");
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

  useEffect(() => {
    setFilteredPlaylists(playlists);
  }, [playlists]);

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
                key={playlist._id}
                playlist={playlist}
                currentUser={currentUser}
                handleFastAdd={handleFastAdd}
                handleRemovePlaylist={handleRemovePlaylist}
                isCreatedPlaylist={currentUser?.created_playlists.includes(
                  playlist._id
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
