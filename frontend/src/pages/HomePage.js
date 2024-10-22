import React, { useContext, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SreachBar";
import SpotifyEmbed from "../components/SpotifyEmbed";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { playlists, songs, users } = useContext(PlaylistContext);
  const [filteredResults, setFilteredResults] = useState({
    songs,
    playlists,
  });

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filteredPlaylists = playlists.filter((playlist) => {
      const playlistNameMatch = playlist.name
        .toLowerCase()
        .includes(lowercasedSearchTerm);

      const hashtagsMatch = playlist.hashtags
        ?.join(", ")
        .toLowerCase()
        .includes(lowercasedSearchTerm);

      const creator = users.find((user) => user.userId === playlist.creatorId);

      const creatorNameMatch = creator?.username
        ?.toLowerCase()
        .includes(lowercasedSearchTerm);

      return playlistNameMatch || hashtagsMatch || creatorNameMatch;
    });

    const filteredSongs = songs.filter(
      (song) =>
        song.name.toLowerCase().includes(lowercasedSearchTerm) ||
        song.artist.toLowerCase().includes(lowercasedSearchTerm)
    );

    setFilteredResults({ songs: filteredSongs, playlists: filteredPlaylists });
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for Any Songs or Playlists..."
        />

        <div className="row mt-5">
          <h3>Songs</h3>
          {filteredResults.songs.length > 0 ? (
            filteredResults.songs.map((song) => (
              <div key={song.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{song.name}</h5>
                    <p className="card-text">Artist: {song.artist}</p>
                    <SpotifyEmbed songLink={song.link} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No songs found.</p>
          )}
        </div>

        <div className="row mt-5">
          <h3>Playlists</h3>
          {filteredResults.playlists.length > 0 ? (
            filteredResults.playlists.map((playlist) => (
              <div key={playlist.id} className="col-md-4 mb-4">
                <div className="card">
                  <Link to={`/playlist/${playlist.id}`}>
                    <img
                      src={playlist.coverImage}
                      className="card-img-top"
                      alt={playlist.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </Link>

                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/playlist/${playlist.id}`}>
                        {playlist.name}
                      </Link>
                    </h5>
                    <p className="card-text">
                      Created by:
                      {users.find((user) => user.userId === playlist.creatorId)
                        ?.username || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No playlists found.</p>
          )}
        </div>
      </div>
    </>
  );
};
