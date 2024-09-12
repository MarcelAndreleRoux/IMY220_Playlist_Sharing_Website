import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

// Example data for songs, playlists, and users
const songs = [
  {
    id: 1,
    name: "Go Again",
    artist: "Jeremy Loops",
    link: "https://open.spotify.com/track/6e5V175wyWLhOyLoM7E4WW?si=1b603a37b0954106",
  },
  {
    id: 2,
    name: "Africa",
    artist: "TOTO",
    link: "https://open.spotify.com/track/2374M0fQpWi3dLnB54qaLX?si=1e45f755c9fc4044",
  },
  {
    id: 3,
    name: "Drive By",
    artist: "Train",
    link: "https://open.spotify.com/track/0KAiuUOrLTIkzkpfpn9jb9?si=3c3b29aea15e4813",
  },
];

const playlists = [
  {
    id: 1,
    name: "Playlist 1",
    songs: [1, 2],
    description: "My first playlist",
  },
  {
    id: 2,
    name: "Playlist 2",
    songs: [1, 2, 3],
    description: "My second playlist",
  },
];

const users = [
  {
    id: 1,
    username: "test1",
    email: "test1@gmail.com",
    password: "Test1111#",
    friends: [2],
  },
  {
    id: 2,
    username: "test2",
    email: "test2@gmail.com",
    friends: [1],
    password: "Test2222#",
  },
];

// Pass data to the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App songs={songs} playlists={playlists} users={users} />);
