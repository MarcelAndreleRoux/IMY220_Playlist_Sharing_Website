import React, { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import PlaylistHeader from "../components/PlaylistHeader";
import SongsInPlaylist from "../components/SongsInPlaylist";
import CommentsSection from "../components/CommentsSection";
import SearchBar from "../components/SreachBar";
import { PlaylistContext } from "../context/PlaylistContext"; // Import context

const PlaylistPage = () => {
  const { playlistid } = useParams();
  const {
    playlists,
    users,
    songs,
    removeSongFromPlaylist,
    updatePlaylistComments,
  } = useContext(PlaylistContext);

  // Ensure playlists is not undefined and find the playlist by id
  const playlist = playlists?.find((pl) => pl.id === parseInt(playlistid));

  // Handle case where playlist isn't found
  if (!playlist) {
    return (
      <div>
        <p>Playlist not found</p>
        <Link to="/home">Go Back Home</Link>
      </div>
    );
  }

  // Extract only the songs from the current playlist
  const playlistSongs = playlist.songs.map((songId) =>
    songs.find((song) => song.id === songId)
  );

  // State to store filtered songs
  const [filteredSongs, setFilteredSongs] = useState(playlistSongs);

  const handleSearch = (searchTerm) => {
    const results = playlistSongs.filter((song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(results);
  };

  const findUserById = (id) => users.find((user) => user.id === id);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <PlaylistHeader
          playlist={playlist}
          userId={parseInt(localStorage.getItem("userId"), 10)}
        />

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search Playlist Songs..."
        />

        <SongsInPlaylist
          songs={filteredSongs}
          removeSongFromPlaylist={removeSongFromPlaylist}
        />

        <div className="button">
          <Link to="/songfeed">
            <button className="add-songs-btn">Add Songs</button>
          </Link>
        </div>

        <CommentsSection
          playlist={playlist}
          findUserById={findUserById}
          updatePlaylistComments={updatePlaylistComments}
        />

        <Link to={`/addcomment/${playlist.id}`} className="add-comment-btn">
          Add a Comment
        </Link>
      </div>
    </>
  );
};

export default PlaylistPage;
