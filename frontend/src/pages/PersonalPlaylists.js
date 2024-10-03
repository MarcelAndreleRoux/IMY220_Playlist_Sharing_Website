import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import PlaylistCard from "../components/PlaylistCard";
import NoPlaylistsMessage from "../components/NoPlaylistsMessage";
import { PlaylistContext } from "../context/PlaylistContext";

const PersonalPlaylists = () => {
  const { userId } = useParams();
  const { users, playlists } = useContext(PlaylistContext);

  // Get the current user from users array
  const user = users.find((user) => user.userId === parseInt(userId));

  if (user && !user.playlists) {
    user.playlists = [];
  }

  // If no user or no playlists, display NoPlaylistsMessage
  if (!user || user.playlists.length === 0) {
    return (
      <>
        <NavBar />
        <NoPlaylistsMessage />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h2>{user.username}'s Playlists</h2>
        <div className="row">
          {user.playlists.map((playlistId) => {
            // Find the corresponding playlist details from the main playlists array
            const playlist = playlists.find((pl) => pl.id === playlistId);

            return playlist ? (
              <div key={playlist.id}>
                <PlaylistCard playlist={playlist} isPersonalView={true} />
              </div>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
};

export default PersonalPlaylists;
