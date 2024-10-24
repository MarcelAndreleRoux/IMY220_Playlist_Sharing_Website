import React, { useContext, useState, useEffect } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SreachBar";
import SpotifyEmbed from "../components/SpotifyEmbed";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { playlists, songs, users } = useContext(PlaylistContext);

  const [filteredResults, setFilteredResults] = useState({
    songs: songs,
    playlists: playlists,
  });

  const [topPlaylists, setTopPlaylists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  // Calculate top playlists and top songs
  useEffect(() => {
    const sortedPlaylists = [...playlists].sort(
      (a, b) => b.followers.length - a.followers.length
    );
    setTopPlaylists(sortedPlaylists.slice(0, 5));

    const sortedSongs = [...songs].sort(
      (a, b) => b.addedToPlaylistsCount - a.addedToPlaylistsCount
    );
    setTopSongs(sortedSongs.slice(0, 10));
  }, [playlists, songs]);

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const matchingUsers = users.filter((user) =>
      user.username.toLowerCase().includes(lowercasedSearchTerm)
    );

    const userIds = matchingUsers.map((user) => user.userId);

    const filteredPlaylists = playlists.filter((playlist) => {
      const creatorMatch = userIds.includes(playlist.creatorId);
      const nameMatch = playlist.name
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      const hashtagMatch = playlist.hashtags
        ?.join(", ")
        .toLowerCase()
        .includes(lowercasedSearchTerm);

      return creatorMatch || nameMatch || hashtagMatch;
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
          placeholder="Search for Songs, Playlists, or Users..."
        />

        {/* All Songs Section */}
        <div className="row mt-5">
          <h3>All Songs</h3>
          {filteredResults.songs.length > 0 ? (
            filteredResults.songs.map((song) => (
              <div key={song.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/song/${song.id}`}>{song.name}</Link>
                    </h5>
                    <p>Artist: {song.artist}</p>
                    <p>Added to Playlists: {song.addedToPlaylistsCount}</p>
                    <SpotifyEmbed songLink={song.link} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No songs found.</p>
          )}
        </div>

        {/* All Playlists Section */}
        <div className="row mt-5">
          <h3>All Playlists</h3>
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
                    <p>Followers: {playlist.followers.length}</p>
                    <p>
                      Created by:{" "}
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

        {/* Top 5 Playlists Section */}
        <div className="row mt-5">
          <h3>Top 5 Playlists</h3>
          {topPlaylists.map((playlist) => (
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
                    <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
                  </h5>
                  <p>Followers: {playlist.followers.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top 10 Songs Section */}
        <div className="row mt-5">
          <h3>Top 10 Songs</h3>
          {topSongs.map((song) => (
            <div key={song.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/song/${song.id}`}>{song.name}</Link>
                  </h5>
                  <p>Artist: {song.artist}</p>
                  <p>Added to Playlists: {song.addedToPlaylistsCount}</p>
                  <SpotifyEmbed songLink={song.link} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
