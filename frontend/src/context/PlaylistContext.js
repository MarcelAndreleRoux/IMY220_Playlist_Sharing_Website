import React, { createContext, useState } from "react";
import { setCookie, getCookie, deleteCookie } from "../utils/utils";

// Create a new context
export const PlaylistContext = createContext();

// Create a provider component
export const PlaylistProvider = ({
  children,
  songs: initialSongs = [],
  playlists: initialPlaylists = [],
  users: initialUsers = [],
}) => {
  const [songs, setSongs] = useState(initialSongs);
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [users, setUsers] = useState(initialUsers);

  const [authenticatedUser, setAuthenticatedUser] = useState(() => {
    const sessionUser = sessionStorage.getItem("authenticatedUser");
    const userId = getCookie("userId");
    if (sessionUser && userId) {
      return JSON.parse(sessionUser);
    }
    return null;
  });

  const genres = ["Pop", "Rock", "Jazz", "Hip Hop", "Classical", "Country"];

  // Set the users Authentication
  const handleSetAuthenticatedUser = (user) => {
    setAuthenticatedUser(user);
    if (user) {
      sessionStorage.setItem("authenticatedUser", JSON.stringify(user));
      setCookie("userId", user.userId, 1);
    } else {
      sessionStorage.removeItem("authenticatedUser");
      deleteCookie("userId");
    }
  };

  // Add a new song to the feed
  const addNewSong = (newSong) => {
    setSongs((prevSongs) => [...prevSongs, newSong]);
  };

  // Add a new playlist to the feed
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
            songs: (playlist.songs || []).filter((id) => id !== songId),
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

  const restoreSong = async (songId) => {
    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDeleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to restore song");
      }

      const restoredSong = await response.json();
      setSongs((prevSongs) =>
        prevSongs.map((song) => (song.id === songId ? restoredSong : song))
      );

      return restoredSong;
    } catch (error) {
      console.error("Error restoring song:", error);
      throw error;
    }
  };

  // Everything being sent as a Context
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
        setSongs,
        restoreSong,
        setPlaylists,
        setUsers,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
