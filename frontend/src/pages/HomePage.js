import React, { useContext } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { NavBar } from "../components/NavBar";

export const HomePage = () => {
  const { playlists, songs, authenticatedUser } = useContext(PlaylistContext);

  return (
    <div>
      <NavBar />
      <h1>Welcome, {authenticatedUser?.username}</h1>
      <h2>Your Playlists:</h2>
      {playlists.map((playlist) => (
        <div key={playlist.id}>
          <h3>{playlist.name}</h3>
        </div>
      ))}
    </div>
  );
};
