import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SreachBar";
import NoSongsMessage from "../components/NoSongsMessage";

const SongsFeedPage = () => {
  const { songs, authenticatedUser, users } = useContext(PlaylistContext);
  const [filteredSongs, setFilteredSongs] = useState(
    songs.filter((song) => !song.isDeleted)
  );

  const handleSearch = (searchTerm) => {
    const results = songs.filter(
      (song) =>
        !song.isDeleted &&
        song.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(results);
  };

  const handleMarkAsDeleted = async (songId) => {
    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDeleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete song");
      }

      // Update filtered songs first
      setFilteredSongs((prevFilteredSongs) =>
        prevFilteredSongs.filter((song) => song.id !== songId)
      );

      // Update main songs state
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.id === songId ? { ...song, isDeleted: true } : song
        )
      );

      // Update playlists with null checks
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) => ({
          ...playlist,
          songs: (playlist.songs || []).map((id) =>
            id === songId ? { id, isDeleted: true } : id
          ),
        }))
      );
    } catch (error) {
      console.error("Error marking song as deleted:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <SearchBar onSearch={handleSearch} placeholder="Search Songs..." />
        <div className="row">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div key={song.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title">{song.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {song.artist}
                    </h6>
                    <SpotifyEmbed songLink={song.link} />
                    <p>
                      Added by:{" "}
                      {users.find((u) => u.userId === song.creatorId)?.username}
                    </p>
                    <p>Added to {song.addedToPlaylistsCount} playlists</p>

                    {(song.creatorId === authenticatedUser?.userId ||
                      authenticatedUser?.role === "admin") && (
                      <button
                        onClick={() => handleMarkAsDeleted(song.id)}
                        className="btn btn-danger m-3"
                      >
                        Delete Song
                      </button>
                    )}

                    <Link
                      to={`/song/${song.id}`}
                      className="btn btn-secondary m-3"
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/addtoplaylist/${song.id}`}
                      className="btn btn-primary m-3"
                    >
                      Add to Playlist
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoSongsMessage />
          )}
        </div>
      </div>

      <Link to="/addsong" className="add-song-btn">
        Add Song
      </Link>

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
        }
        .add-song-btn:hover {
          background-color: #218838;
          text-decoration: none;
        }
      `}</style>
    </>
  );
};

export default SongsFeedPage;
