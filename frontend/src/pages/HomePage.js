import React, { useContext, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SreachBar";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";

export const HomePage = () => {
  const { playlists, songs, users, authenticatedUser } =
    useContext(PlaylistContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "songs"
  );

  // Get current user's friends
  const userFriends = authenticatedUser ? authenticatedUser.friends || [] : [];

  // Filter playlists to only show those from friends and followed playlists
  const friendsPlaylists = playlists.filter((playlist) => {
    const isCreatedByFriend = userFriends.includes(playlist.creatorId);
    const isFollowedByUser = authenticatedUser?.playlists?.includes(
      playlist.id
    );
    return isCreatedByFriend || isFollowedByUser;
  });

  const [filteredResults, setFilteredResults] = useState({
    songs: songs.filter((song) => !song.isDeleted),
    playlists: friendsPlaylists,
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSearch = (searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();

    if (activeTab === "songs") {
      const filteredSongs = songs.filter(
        (song) =>
          !song.isDeleted &&
          (song.name.toLowerCase().includes(lowercasedTerm) ||
            song.artist.toLowerCase().includes(lowercasedTerm))
      );
      setFilteredResults((prev) => ({ ...prev, songs: filteredSongs }));
    } else {
      // Filter within friends' playlists only
      const filteredPlaylists = friendsPlaylists.filter(
        (playlist) =>
          playlist.name.toLowerCase().includes(lowercasedTerm) ||
          playlist.hashtags?.some((tag) =>
            tag.toLowerCase().includes(lowercasedTerm)
          )
      );
      setFilteredResults((prev) => ({ ...prev, playlists: filteredPlaylists }));
    }
  };

  const playlistsFeedDescription =
    "Activity from friends and followed playlists";

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <div
          className="mb-4"
          style={{
            backgroundColor: "#8e44ad",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <SearchBar
            onSearch={handleSearch}
            placeholder={`Search ${
              activeTab === "songs" ? "Songs" : "Playlists"
            }...`}
          />
        </div>

        <div className="d-flex mb-4">
          <button
            className={`btn ${
              activeTab === "songs" ? "btn-danger" : "btn-outline-danger"
            } flex-grow-1 me-2`}
            onClick={() => handleTabChange("songs")}
          >
            Songs Feed
          </button>
          <button
            className={`btn ${
              activeTab === "playlists" ? "btn-primary" : "btn-outline-primary"
            } flex-grow-1`}
            onClick={() => handleTabChange("playlists")}
          >
            Friends' Activity
          </button>
        </div>

        {activeTab === "playlists" && (
          <p className="text-muted mb-4">{playlistsFeedDescription}</p>
        )}

        <div className="row">
          {activeTab === "songs"
            ? // Songs Feed
              filteredResults.songs.map((song) => (
                <div key={song.id} className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{song.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {song.artist}
                      </h6>
                      <SpotifyEmbed songLink={song.link} />
                      <p>
                        Added by:{" "}
                        {
                          users.find((u) => u.userId === song.creatorId)
                            ?.username
                        }
                      </p>
                      <p>Added to {song.addedToPlaylistsCount} playlists</p>
                      <div className="mt-2">
                        <Link
                          to={`/song/${song.id}`}
                          className="btn btn-secondary btn-sm me-2"
                        >
                          View Details
                        </Link>
                        <Link
                          to={`/addtoplaylist/${song.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Add to Playlist
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : // Playlists Feed
              filteredResults.playlists.map((playlist) => (
                <div key={playlist.id} className="col-md-3 mb-4">
                  <div className="card">
                    <Link to={`/playlist/${playlist.id}`}>
                      <img
                        src={playlist.coverImage}
                        alt={playlist.name}
                        className="card-img-top"
                        style={{ height: "160px", objectFit: "cover" }}
                      />
                    </Link>
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link
                          to={`/playlist/${playlist.id}`}
                          className="text-decoration-none"
                        >
                          {playlist.name}
                        </Link>
                      </h5>
                      <p className="card-text">
                        By{" "}
                        {
                          users.find((u) => u.userId === playlist.creatorId)
                            ?.username
                        }
                      </p>
                      <p className="card-text">
                        {playlist.followers?.length || 0} Followers
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <Link to="/addsong" className="add-song-btn">
          Add Song
        </Link>
      </div>

      <style>{`
        .add-song-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #28a745;
          color: white;
          padding: 15px 20px;
          border-radius: 50px;
          text-align: center;
          font-size: 18px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          text-decoration: none;
        }
        .add-song-btn:hover {
          background-color: #218838;
          color: white;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};
