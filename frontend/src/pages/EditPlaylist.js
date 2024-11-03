import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistDetailsForm from "../components/PlaylistDetailsForm";
import ReorderSongs from "../components/ReorderSongs";

const EditPlaylist = () => {
  const {
    playlists,
    songs,
    genres,
    setPlaylists,
    setSongs,
    setUsers,
    authenticatedUser,
    setAuthenticatedUser,
  } = useContext(PlaylistContext);
  const { playlistid } = useParams();
  const navigate = useNavigate();

  const playlist = playlists.find((pl) => pl._id === playlistid);

  useEffect(() => {
    if (!playlist || playlist.creatorId !== authenticatedUser?._id) {
      alert("You are not authorized to edit this playlist");
      navigate("/playlistfeed");
    }
  }, [playlist, authenticatedUser, navigate]);

  const [name, setName] = useState(playlist?.name || "");
  const [genre, setGenre] = useState(playlist?.genre || "");
  const [coverImage, setCoverImage] = useState(playlist?.coverImage || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [hashtags, setHashtags] = useState(playlist?.hashtags.join(", ") || "");
  const [playlistSongs, setPlaylistSongs] = useState(playlist?.songs || []);
  const [imageFile, setImageFile] = useState(null);

  // Handle saving changes to the playlist
  const handleSaveChanges = async () => {
    try {
      const updatedHashtags = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Update playlist data
      const updatedPlaylist = {
        name,
        genre,
        description,
        hashtags: updatedHashtags,
        songs: playlistSongs,
      };

      let imageUrl = coverImage;
      if (imageFile instanceof File) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const imageResponse = await fetch(
          `/api/playlists/${playlistid}/image`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const imageData = await imageResponse.json();
        imageUrl = imageData.result.coverImage;
      }

      const response = await fetch(`/api/playlists/${playlistid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedPlaylist,
          coverImage: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }

      const { result: finalPlaylist } = await response.json();

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) => (pl._id === playlistid ? finalPlaylist : pl))
      );

      navigate(`/playlist/${playlistid}`);
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  // Handle deleting the playlist
  const handleDeletePlaylist = async () => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }

    try {
      // Decrement `addedToPlaylistsCount` for each song in the playlist
      await Promise.all(
        playlist.songs.map(async (songId) => {
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
        })
      );

      // Remove playlist from creator's created_playlists and playlists arrays
      const updatedUser = {
        ...authenticatedUser,
        created_playlists: authenticatedUser.created_playlists.filter(
          (id) => id !== playlistid
        ),
        playlists: authenticatedUser.playlists.filter(
          (id) => id !== playlistid
        ),
      };

      // Update user in database
      const userResponse = await fetch(`/api/users/${authenticatedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          created_playlists: updatedUser.created_playlists,
          playlists: updatedUser.playlists,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to update user");
      }

      // Delete the playlist from the server
      const response = await fetch(`/api/playlists/${playlistid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }

      // Update all states
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((pl) => pl._id !== playlistid)
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === authenticatedUser._id ? updatedUser : user
        )
      );

      // Update authenticated user and session
      setAuthenticatedUser(updatedUser);
      sessionStorage.setItem("authenticatedUser", JSON.stringify(updatedUser));

      navigate("/home?tab=playlists");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist");
    }
  };

  const handleImageSelect = (file) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setCoverImage("");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Edit Playlist</h1>

      <PlaylistDetailsForm
        name={name}
        setName={setName}
        genre={genre}
        setGenre={setGenre}
        coverImage={coverImage}
        setCoverImage={setCoverImage}
        description={description}
        setDescription={setDescription}
        hashtags={hashtags}
        setHashtags={setHashtags}
        genres={genres}
        onImageSelect={handleImageSelect}
      />

      <ReorderSongs
        playlistSongs={playlistSongs}
        setPlaylistSongs={setPlaylistSongs}
        songs={songs}
        playlistId={playlistid}
      />

      <div className="mt-4">
        <button
          type="button"
          className="btn btn-success me-2"
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDeletePlaylist}
        >
          Delete Playlist
        </button>
        <Link to={`/playlist/${playlistid}`} className="btn btn-secondary ms-2">
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default EditPlaylist;
