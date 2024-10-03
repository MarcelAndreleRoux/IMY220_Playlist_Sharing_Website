import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PlaylistProvider } from "./context/PlaylistContext";
import { SplashPage } from "./pages/SplashPage";
import SplashLogin from "./pages/SplashLogin";
import SplashRegister from "./pages/SplashRegister";
import { HomePage } from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PlaylistPage from "./pages/PlaylistPage";
import PersonalPlaylists from "./pages/PersonalPlaylists";
import SongPage from "./pages/SongPage";
import AddSongToPlaylistPage from "./components/AddSongToPlaylistPage";
import SongsFeedPage from "./pages/SongsFeedPage";
import PlaylistFeedPage from "./pages/PlaylistFeedPage";
import AddSongPage from "./components/AddSongPage";
import EditProfile from "./pages/EditProfile";
import EditPlaylist from "./pages/EditPlaylist";
import AddPlaylistComment from "./components/AddPlaylistComment";
import AddToPlaylistPage from "./components/AddToPlaylistPage";

export class App extends React.Component {
  render() {
    const { songs, playlists, users } = this.props;

    const router = createBrowserRouter([
      {
        path: "/",
        element: <SplashPage />,
      },
      {
        path: "/login",
        element: <SplashLogin />,
      },
      {
        path: "/register",
        element: <SplashRegister />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/profile/:userid",
        element: <ProfilePage />,
      },
      {
        path: "/edit_profile/:userid",
        element: <EditProfile />,
      },
      {
        path: "/playlist/:playlistid",
        element: <PlaylistPage />,
      },
      {
        path: "/my_playlists/:userId",
        element: <PersonalPlaylists />,
      },
      {
        path: "/addtoplaylist/:songid",
        element: <AddSongToPlaylistPage />,
      },
      {
        path: "/songfeed",
        element: <SongsFeedPage />,
      },
      {
        path: "/playlistfeed",
        element: <PlaylistFeedPage />,
      },
      {
        path: "/create_playlist",
        element: <AddToPlaylistPage />,
      },
      {
        path: "/song/:songid",
        element: <SongPage />,
      },
      {
        path: "/addsong",
        element: <AddSongPage />,
      },
      {
        path: "/edit_playlist/:playlistid",
        element: <EditPlaylist />,
      },
      {
        path: "/addcomment/:playlistid",
        element: <AddPlaylistComment />,
      },
      {
        path: "*",
        element: <div>404 Error - Page Not Found</div>,
      },
    ]);

    return (
      <PlaylistProvider songs={songs} playlists={playlists} users={users}>
        <RouterProvider router={router} />
      </PlaylistProvider>
    );
  }
}
