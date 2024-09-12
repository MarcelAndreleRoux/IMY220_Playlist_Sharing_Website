import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import DefaultImage from "../public/assets/images/profile_image_default.jpg";
import DefaultEdit from "../public/assets/images/edit_default_image.png";

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
    coverImage:
      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg",
    hashtags: ["#chill", "#relax"],
    creatorId: 1,
    creationDate: "2024-09-11",
    comments: [
      {
        id: 1,
        userId: 2,
        text: "Great playlist! Love the song choices.",
        stars: 5,
        likes: 10,
      },
      {
        id: 2,
        userId: 1,
        text: "Amazing vibes!",
        stars: 4,
        likes: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Playlist 2",
    songs: [1, 2, 3],
    description: "My second playlist",
    coverImage:
      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg",
    hashtags: ["#upbeat", "#party"],
    creatorId: 2,
    creationDate: "2024-09-12",
    comments: [
      {
        id: 3,
        userId: 1,
        text: "This playlist gets me moving!",
        stars: 4,
        likes: 5,
      },
    ],
  },
];

const users = [
  {
    userId: 1,
    username: "test1",
    email: "test1@gmail.com",
    password: "Test1111#",
    friends: [2],
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    playlists: [],
  },
  {
    userId: 2,
    username: "test2",
    email: "test2@gmail.com",
    friends: [1],
    password: "Test2222#",
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    playlists: [],
  },
];

// Pass data to the App component
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App songs={songs} playlists={playlists} users={users} />);
