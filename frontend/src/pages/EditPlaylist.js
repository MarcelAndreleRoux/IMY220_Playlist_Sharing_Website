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

  const playlist = playlists.find((pl) => pl.id === parseInt(playlistid));
  const userId = localStorage.getItem("userId");

  // If the playlist doesn't exist or the user isn't the owner, redirect back
  useEffect(() => {
    if (!playlist || playlist.creatorId !== parseInt(userId)) {
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

  // Update playlist details
  const handleSaveChanges = () => {
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
    };

    const updatedPlaylists = playlists.map((pl) =>
      pl.id === parseInt(playlistid) ? updatedPlaylist : pl
    );

    setPlaylists(updatedPlaylists);
    navigate(`/playlist/${playlistid}`);
  };

  // Handle playlist deletion
  const handleDeletePlaylist = () => {
    const updatedPlaylists = playlists.filter(
      (pl) => pl.id !== parseInt(playlistid)
    );
    setPlaylists(updatedPlaylists);
    navigate("/playlistfeed");
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
