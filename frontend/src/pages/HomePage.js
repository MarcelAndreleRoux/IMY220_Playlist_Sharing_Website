import React, { useContext, useState, useEffect, useMemo } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SreachBar";
import SpotifyEmbed from "../components/SpotifyEmbed";
import { Link, Navigate } from "react-router-dom";

export const HomePage = () => {
  const { playlists, songs, users, authenticatedUser } =
    useContext(PlaylistContext);

  const [filteredResults] = useMemo(() => {
    return {
      songs: songs.map((song) => ({
        ...song,
        isDeleted: song.isDeleted || false,
      })),
      playlists: playlists,
    };
  }, [songs, playlists]);

  const [topPlaylists, setTopPlaylists] = useState([]);
  const [topSongs, setTopSongs] = useState([]);

  // useMemo Allows me to stop rerenders from happeing every frame as the valuesare cached between re-renders
  const friendsPlaylists = useMemo(() => {
    return authenticatedUser
      ? playlists.filter((playlist) =>
          authenticatedUser.friends?.includes(
            users.find((user) => user.userId === playlist.creatorId)?.userId
          )
        )
      : [];
  }, [authenticatedUser, playlists, users]);

  const friendsSongs = useMemo(() => {
    return authenticatedUser
      ? songs.filter((song) =>
          authenticatedUser.friends?.includes(
            users.find((user) => user.userId === song.creatorId)?.userId
          )
        )
      : [];
  }, [authenticatedUser, songs, users]);

  // Calculate top playlists and top songs
  useEffect(() => {
    if (friendsPlaylists.length > 0) {
      setTopPlaylists(
        [...friendsPlaylists]
          .sort((a, b) => b.followers.length - a.followers.length)
          .slice(0, 5)
      );
    }

    if (friendsSongs.length > 0) {
      setTopSongs(
        [...friendsSongs]
          .sort((a, b) => b.addedToPlaylistsCount - a.addedToPlaylistsCount)
          .slice(0, 10)
      );
    }
  }, [friendsPlaylists, friendsSongs]);

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    // Helper function to check if a string contains the search term
    const matchesSearchTerm = (str) =>
      str?.toLowerCase().includes(lowercasedSearchTerm);

    // Find matching users
    const matchingUsers = users.filter(
      (user) => matchesSearchTerm(user.username) || matchesSearchTerm(user.name)
    );
    const userIds = matchingUsers.map((user) => user.userId);

    // Find matching songs (including deleted ones, but mark them)
    const matchingSongs = songs.filter(
      (song) =>
        (!song.isDeleted || searchTerm.startsWith("#")) && // Only include non-deleted songs unless searching hashtags
        (matchesSearchTerm(song.name) || matchesSearchTerm(song.artist))
    );
    const songIds = matchingSongs.map((song) => song.id);

    // Find playlists containing matching songs
    const playlistsWithMatchingSongs = playlists.filter((playlist) =>
      playlist.songs?.some((songId) => songIds.includes(songId))
    );

    // Find matching playlists
    const matchingPlaylists = playlists.filter((playlist) => {
      // Check if creator matches
      const creatorMatch = userIds.includes(playlist.creatorId);

      // Check if name matches
      const nameMatch = matchesSearchTerm(playlist.name);

      // Check if genre matches
      const genreMatch = matchesSearchTerm(playlist.genre);

      // Check hashtags - both in search term and playlist hashtags
      const hashtagMatch = searchTerm.startsWith("#")
        ? playlist.hashtags?.some(
            (tag) => matchesSearchTerm(tag) || matchesSearchTerm("#" + tag)
          )
        : playlist.hashtags?.some((tag) => matchesSearchTerm(tag));

      // Check if playlist contains any matching songs
      const containsMatchingSong =
        playlistsWithMatchingSongs.includes(playlist);

      // Return true if any criteria matches
      return (
        creatorMatch ||
        nameMatch ||
        genreMatch ||
        hashtagMatch ||
        containsMatchingSong
      );
    });

    setFilteredResults({
      songs: matchingSongs,
      playlists: matchingPlaylists,
      users: matchingUsers,
    });
  };

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search for Songs, Playlists, or Users..."
        />

        <div className="row mt-5">
          <h3>All Songs</h3>
          {filteredResults.songs.map((song) => (
            <div key={song.id} className="col-md-4 mb-4">
              <div className={`card ${song.isDeleted ? "bg-light" : ""}`}>
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/song/${song.id}`}>{song.name}</Link>
                    {song.isDeleted && (
                      <span className="badge bg-secondary ms-2">Deleted</span>
                    )}
                  </h5>
                  <p>Artist: {song.artist}</p>
                  <p>Added to Playlists: {song.addedToPlaylistsCount}</p>
                  {!song.isDeleted ? (
                    <>
                      <SpotifyEmbed songLink={song.link} />
                      <Link
                        to={`/addtoplaylist/${song.id}`}
                        className="btn btn-primary mt-2"
                      >
                        Add to Playlist
                      </Link>
                    </>
                  ) : (
                    <p className="text-muted">Song no longer available</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

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
