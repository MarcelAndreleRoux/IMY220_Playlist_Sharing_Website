import React, { createContext, useState } from "react";

// Create a new context
export const PlaylistContext = createContext();

// Create a provider component
export const PlaylistProvider = ({
  children,
  songs: initialSongs,
  playlists: initialPlaylists,
  users: initialUsers,
}) => {
  // State for songs, playlists, users, genres, and authenticatedUser
  const [songs, setSongs] = useState(initialSongs || []);
  const [playlists, setPlaylists] = useState(initialPlaylists || []);
  const [users, setUsers] = useState(initialUsers || []);

  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const user = localStorage.getItem("authenticatedUser");
    return user ? JSON.parse(user) : null;
  });

  const genres = ["Pop", "Rock", "Jazz", "Hip Hop", "Classical", "Country"];

  const handleSetAuthenticatedUser = (user) => {
    setAuthenticatedUser(user);
    localStorage.setItem("authenticatedUser", JSON.stringify(user));
  };

  const addNewSong = (newSong) => {
    setSongs((prevSongs) => [...prevSongs, newSong]);
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
