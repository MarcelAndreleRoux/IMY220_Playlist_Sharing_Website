import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import PlaylistDetailsForm from "../components/PlaylistDetailsForm";
import ReorderSongs from "../components/ReorderSongs";

const EditPlaylist = () => {
  const { playlists, songs, genres, setPlaylists } =
    useContext(PlaylistContext);
  const { playlistid } = useParams();
  const navigate = useNavigate();

  // Fetch authenticated user info from localStorage
  const authenticatedUser = JSON.parse(
    localStorage.getItem("authenticatedUser")
  );

  const userId = authenticatedUser?.userId; // Extract userId from authenticated user

  const playlist = playlists.find((pl) => pl.id === parseInt(playlistid));

  // Ensure the playlist exists and the user is authorized to edit
  useEffect(() => {
    if (!playlist || playlist.creatorId !== userId) {
      alert("You are not authorized to edit this playlist");
      navigate("/playlistfeed");
    }
  }, [playlist, userId, navigate]);

  const [name, setName] = useState(playlist?.name || "");
  const [genre, setGenre] = useState(playlist?.genre || "");
  const [coverImage, setCoverImage] = useState(playlist?.coverImage || "");
  const [description, setDescription] = useState(playlist?.description || "");
  const [hashtags, setHashtags] = useState(playlist?.hashtags.join(", ") || "");
  const [playlistSongs, setPlaylistSongs] = useState(playlist?.songs || []);

  // Handle saving changes to the playlist
  const handleSaveChanges = async () => {
    try {
      const updatedHashtags = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const updatedPlaylist = {
        ...playlist,
        name,
        genre,
        coverImage,
        description,
        hashtags: updatedHashtags,
        songs: playlistSongs,
        followers: playlist.followers || [],
      };

      const response = await fetch(`/api/playlists/${playlistid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPlaylist),
      });

      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }

      // Update local state with the complete playlist object
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((pl) =>
          pl.id === parseInt(playlistid) ? updatedPlaylist : pl
        )
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
      const response = await fetch(`/api/playlists/${playlistid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }

      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((pl) => pl.id !== parseInt(playlistid))
      );

      // Also update the creator's created_playlists array
      const userResponse = await fetch(
        `/api/users/${authenticatedUser.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            created_playlists: authenticatedUser.created_playlists.filter(
              (id) => id !== parseInt(playlistid)
            ),
          }),
        }
      );

      if (!userResponse.ok) {
        console.warn("Failed to update user created playlists");
      }

      navigate("/home?tab=playlists");
    } catch (error) {
      console.error("Error deleting playlist:", error);
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
      />

      <ReorderSongs
        playlistSongs={playlistSongs}
        setPlaylistSongs={setPlaylistSongs}
        songs={songs}
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
