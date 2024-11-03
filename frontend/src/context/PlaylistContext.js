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
      setCookie("userId", user._id, 1);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add song");
      }

      const { result } = await response.json();

      // Ensure the song has all required properties before adding to state
      const songWithDefaults = {
        ...result,
        addedToPlaylistsCount: result.addedToPlaylistsCount || 0,
        isDeleted: result.isDeleted || false,
      };

      // Update the songs state with the new song
      setSongs((prevSongs) => [...prevSongs, songWithDefaults]);
      return songWithDefaults;
    } catch (error) {
      console.error("Error adding song:", error);
      throw error;
    }
  };

  // Add a new playlist to the feed
  const addNewPlaylist = async (playlistData) => {
    try {
      // Create the playlist
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }

      // Get the created playlist with its MongoDB _id
      const { result: newPlaylist } = await response.json();

      // Update the user's created_playlists and playlists arrays
      const userUpdateResponse = await fetch(
        `/api/users/${authenticatedUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            created_playlists: [
              ...authenticatedUser.created_playlists,
              newPlaylist._id,
            ],
            playlists: [...authenticatedUser.playlists, newPlaylist._id],
          }),
        }
      );

      if (!userUpdateResponse.ok) {
        throw new Error("Failed to update user playlists");
      }

      const updatedUser = {
        ...authenticatedUser,
        created_playlists: [
          ...authenticatedUser.created_playlists,
          newPlaylist._id,
        ],
        playlists: [...authenticatedUser.playlists, newPlaylist._id],
      };

      setPlaylists((prevPlaylists) => [...prevPlaylists, newPlaylist]);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === authenticatedUser._id ? updatedUser : user
        )
      );

      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

      return newPlaylist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  };

  // Add a song to a playlist
  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const playlist = playlists.find((pl) => pl._id === playlistId);
      if (!playlist) throw new Error("Playlist not found");

      if (playlist.songs && playlist.songs.includes(songId)) {
        return; // Song is already in the playlist, no need to add
      }

      // Add song to playlist in MongoDB
      const playlistResponse = await fetch(`/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songs: [...(playlist.songs || []), songId] }),
      });

      if (!playlistResponse.ok) {
        throw new Error("Failed to add song to playlist");
      }

      // Update the playlists in local state
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl._id === playlistId
            ? { ...pl, songs: [...(pl.songs || []), songId] }
            : pl
        )
      );

      // Increment `addedToPlaylistsCount` for the song
      const song = songs.find((s) => s._id === songId);
      if (song) {
        const newCount = (song.addedToPlaylistsCount || 0) + 1;

        const songResponse = await fetch(`/api/songs/${songId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addedToPlaylistsCount: newCount }),
        });

        if (!songResponse.ok) {
          throw new Error("Failed to update song count");
        }

        // Corrected local state update
        setSongs((prevSongs) =>
          prevSongs.map((s) =>
            s._id === songId ? { ...s, addedToPlaylistsCount: newCount } : s
          )
        );
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  // Remove song from playlist
  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const playlist = playlists.find((p) => p._id === playlistId);
      if (!playlist) throw new Error("Playlist not found");

      const updatedSongs = playlist.songs.filter((id) => id !== songId);

      // Update playlist on server
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

      // Decrement addedToPlaylistsCount on the song
      const song = songs.find((s) => s._id === songId);
      if (song) {
        const newCount = Math.max((song.addedToPlaylistsCount || 0) - 1, 0);

        await fetch(`/api/songs/${songId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addedToPlaylistsCount: newCount }),
        });

        setSongs((prevSongs) =>
          prevSongs.map((s) =>
            s._id === songId ? { ...s, addedToPlaylistsCount: newCount } : s
          )
        );
      }

      // Update local state to remove song from playlist
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((p) =>
          p._id === playlistId ? { ...p, songs: updatedSongs } : p
        )
      );
    } catch (error) {
      console.error("Error removing song from playlist:", error);
    }
  };

  const handleLikePlaylist = async (playlistId) => {
    if (authenticatedUser.playlists.includes(playlistId)) return;

    try {
      const updatedPlaylists = [...authenticatedUser.playlists, playlistId];

      // Update users playlists
      const userResponse = await fetch(`/api/users/${authenticatedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlists: updatedPlaylists }),
      });

      if (!userResponse.ok) throw new Error("Failed to like playlist");

      // Update playlist followers
      const playlist = playlists.find((p) => p._id === playlistId);
      const updatedFollowers = [
        ...(playlist.followers || []),
        authenticatedUser._id,
      ];

      const playlistResponse = await fetch(`/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followers: updatedFollowers }),
      });

      if (!playlistResponse.ok)
        throw new Error("Failed to update playlist followers");

      // Update local state
      const updatedUser = { ...authenticatedUser, playlists: updatedPlaylists };
      const updatedPlaylist = { ...playlist, followers: updatedFollowers };

      setAuthenticatedUser(updatedUser);
      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((p) => (p._id === playlistId ? updatedPlaylist : p))
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === authenticatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error liking playlist:", error);
    }
  };

  const handleUnlikePlaylist = async (playlistId) => {
    if (!authenticatedUser.playlists.includes(playlistId)) return;

    try {
      const updatedPlaylists = authenticatedUser.playlists.filter(
        (id) => id !== playlistId
      );

      // Update users playlists
      const userResponse = await fetch(`/api/users/${authenticatedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlists: updatedPlaylists }),
      });

      if (!userResponse.ok) throw new Error("Failed to unlike playlist");

      // Update playlist followers
      const playlist = playlists.find((p) => p._id === playlistId);
      const updatedFollowers = playlist.followers.filter(
        (followerId) => followerId !== authenticatedUser._id
      );

      const playlistResponse = await fetch(`/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followers: updatedFollowers }),
      });

      if (!playlistResponse.ok)
        throw new Error("Failed to update playlist followers");

      // Update local state
      const updatedUser = { ...authenticatedUser, playlists: updatedPlaylists };
      const updatedPlaylist = { ...playlist, followers: updatedFollowers };

      setAuthenticatedUser(updatedUser);
      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((p) => (p._id === playlistId ? updatedPlaylist : p))
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === authenticatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error unliking playlist:", error);
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
        handleLikePlaylist,
        handleUnlikePlaylist,
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
