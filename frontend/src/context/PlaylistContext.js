import React, { createContext, useState, useEffect } from "react";

// Create a new context
export const PlaylistContext = createContext();

// Create a provider component
export const PlaylistProvider = ({
  children,
  songs: initialSongs = [],
  playlists: initialPlaylists = [],
  users: initialUsers = [],
}) => {
  // State for songs, playlists, users, genres, and authenticatedUser
  const [songs, setSongs] = useState(initialSongs);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [users, setUsers] = useState(initialUsers);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const genres = ["Pop", "Rock", "Jazz", "Hip Hop", "Classical", "Country"];

  // Function to handle authenticated user
  const handleSetAuthenticatedUser = (username, email, userId) => {
    setAuthenticatedUser({ username, email, userId });
    localStorage.setItem("userId", userId);
  };

  const addNewSong = (newSong) => {
    setSongs((prevSongs) => [...prevSongs, newSong]); // Add the new song to the global songs state
  };

  // Add a new playlist
  const addNewPlaylist = (newPlaylist) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);

    // Update users
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((user) => {
        if (user.userId === parseInt(userId)) {
          return {
            ...user,
            playlists: [...(user.playlists || []), newPlaylist],
          };
        }
        return user;
      });
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  // Add a song to a playlist
  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prevPlaylists) => {
      return prevPlaylists.map((playlist) => {
        if (playlist.id === playlistId) {
          const songs = playlist.songs || [];
          return { ...playlist, songs: [...songs, song.id] };
        }
        return playlist;
      });
    });
  };

  // Remove song from playlist
  const removeSongFromPlaylist = (playlistId, songId) => {
    setPlaylists((prevPlaylists) => {
      return prevPlaylists.map((playlist) => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            songs: playlist.songs.filter((id) => id !== songId),
          };
        }
        return playlist;
      });
    });
  };

  // Update playlist comments
  const updatePlaylistComments = (playlistId, updatedComments) => {
    setPlaylists((prevPlaylists) => {
      return prevPlaylists.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, comments: updatedComments };
        }
        return playlist;
      });
    });
  };

  // Fetch user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");

    if (storedUser) {
      const users = JSON.parse(sessionStorage.getItem("users")) || [];
      const authenticatedUser = users.find(
        (user) => user.userId === parseInt(storedUser)
      );
      setAuthenticatedUser(authenticatedUser);
    }
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        songs,
        playlists,
        users,
        genres,
        authenticatedUser,
        setAuthenticatedUser: handleSetAuthenticatedUser,
        addNewPlaylist,
        addNewSong,
        addSongToPlaylist,
        removeSongFromPlaylist,
        updatePlaylistComments,
        setPlaylists,
        setUsers,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
