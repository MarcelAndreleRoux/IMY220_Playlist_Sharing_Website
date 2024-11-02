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

  const [songsCount, setSongsCount] = useState(initialSongs.length);
  const [playlistsCount, setPlaylistsCount] = useState(initialPlaylists.length);
  const [usersCount, setUsersCount] = useState(initialUsers.length);

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
  const addNewSong = async (newSong) => {
    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSong),
      });

      if (!response.ok) throw new Error("Failed to add song");

      const savedSong = await response.json();
      setSongs((prevSongs) => [...prevSongs, savedSong.result]);
      setSongsCount((prev) => prev + 1);
      return savedSong.result;
    } catch (error) {
      console.error("Error adding song:", error);
      throw error;
    }
  };

  // Add a new playlist to the feed
  const addNewPlaylist = async (newPlaylist) => {
    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlaylist),
      });

      if (!response.ok) throw new Error("Failed to add playlist");

      const savedPlaylist = await response.json();
      setPlaylists((prevPlaylists) => [...prevPlaylists, savedPlaylist.result]);
      setPlaylistsCount((prev) => prev + 1);
      return savedPlaylist.result;
    } catch (error) {
      console.error("Error adding playlist:", error);
      throw error;
    }
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
  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (!playlist) throw new Error("Playlist not found");

      const updatedSongs = (playlist.songs || []).filter((id) => id !== songId);

      // Update on server
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          songs: updatedSongs,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }

      // Update local state
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((p) =>
          p.id === playlistId ? { ...p, songs: updatedSongs } : p
        )
      );
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      throw error;
    }
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
        songsCount,
        playlistsCount,
        usersCount,
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
