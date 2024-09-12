import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SongFeed } from "./components/SongsFeedPage";
import { SplashLogin } from "./components/SplashLogin";
import { SplashRegister } from "./components/SplashRegister";

export class App extends React.Component {
  render() {
    const { songs, playlists, users } = this.props;

    // Set up your routes
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Splash />,
      },
      {
        path: "/splashlogin",
        element: <SplashLogin users={users} />,
      },
      {
        path: "/splashregister",
        element: <SplashRegister users={users} />,
      },
      {
        path: "/home",
        element: <HomePage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/profile/:userid",
        element: <HomePage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/playlist/:playlistid",
        element: <HomePage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/playist_list",
        element: <HomePage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/addtoplaylist/:songid",
        element: <HomePage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/songfeed",
        element: <SongFeed playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/song/:songid",
        element: <SongFeed playlists={playlists} songs={songs} users={users} />,
      },
    ]);

    return (
      <div>
        <RouterProvider router={router} />
      </div>
    );
  }
}
