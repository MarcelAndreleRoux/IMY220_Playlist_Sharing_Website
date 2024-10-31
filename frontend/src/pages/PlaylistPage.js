import React, { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import CommentsSection from "../components/CommentsSection";
import SongsInPlaylist from "../components/SongsInPlaylist";
import { PlaylistContext } from "../context/PlaylistContext";

const PlaylistPage = () => {
  const { playlistid } = useParams();
  const { playlists, users, songs, setPlaylists, removeSongFromPlaylist } =
    useContext(PlaylistContext);

  const playlist = playlists.find((pl) => pl.id === parseInt(playlistid)) || {
    songs: [],
  };
  const currentUser = JSON.parse(localStorage.getItem("authenticatedUser"));
  const isCreator = currentUser?.created_playlists.includes(playlist.id);
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.playlists.includes(playlist.id)
  );

  const handleFollow = () => {
    const updatedUser = {
      ...currentUser,
      playlists: [...currentUser.playlists, playlist.id],
    };

    const updatedUsers = users.map((user) =>
      user.userId === currentUser.userId ? updatedUser : user
    );

    const updatedPlaylist = {
      ...playlist,
      followers: [...playlist.followers, currentUser.userId],
    };
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlist.id ? updatedPlaylist : pl))
    );
    setIsFollowing(true);
  };

  const handleUnfollow = () => {
    const updatedUser = {
      ...currentUser,
      playlists: currentUser.playlists.filter((id) => id !== playlist.id),
    };
    const updatedUsers = users.map((user) =>
      user.userId === currentUser.userId ? updatedUser : user
    );
    const updatedPlaylist = {
      ...playlist,
      followers: playlist.followers.filter((id) => id !== currentUser.userId),
    };
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlist.id ? updatedPlaylist : pl))
    );
    setIsFollowing(false);
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div className="d-flex align-items-center mb-4">
          <img
            src={playlist.coverImage || "https://via.placeholder.com/150"}
            className="img-thumbnail"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
            alt="Cover"
          />
          <div className="ms-4">
            <h1>{playlist.name}</h1>
            <p className="text-muted">
              By{" "}
              {users.find((u) => u.userId === playlist.creatorId)?.username ||
                "Unknown"}
            </p>
            <p>{playlist.genre}</p>
            <div>
              {playlist.hashtags
                ? playlist.hashtags.map((tag, i) => (
                    <span key={i} className="badge bg-secondary me-1">
                      #{tag}
                    </span>
                  ))
                : ""}
            </div>
            <p>{playlist.followers.length} Followers</p>
            <div className="mt-4">
              {isCreator ? (
                <Link to={`/edit_playlist/${playlist.id}`}>
                  <button className="btn btn-warning">Edit Playlist</button>
                </Link>
              ) : isFollowing ? (
                <button className="btn btn-danger" onClick={handleUnfollow}>
                  Unfollow
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleFollow}>
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>

        <SongsInPlaylist
          playlist={playlist}
          songs={songs}
          removeSongFromPlaylist={(songId) =>
            removeSongFromPlaylist(playlist.id, songId)
          }
        />

        <CommentsSection
          playlist={playlist}
          currentUser={currentUser}
          findUserById={(id) => users.find((user) => user.userId === id)}
          updatePlaylistComments={(id, comments) =>
            setPlaylists((prev) =>
              prev.map((pl) => (pl.id === id ? { ...pl, comments } : pl))
            )
          }
        />
      </div>
    </>
  );
};

export default PlaylistPage;
