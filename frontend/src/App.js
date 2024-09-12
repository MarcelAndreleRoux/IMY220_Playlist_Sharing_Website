import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SongFeed } from "./pages/SongsFeedPage";
import { SplashLogin } from "./pages/SplashLogin";
import { SplashRegister } from "./pages/SplashRegister";
import { ProfilePage } from "./pages/ProfilePage";
import { SplashPage } from "./pages/SplashPage";
import PlaylistPage from "./pages/PlaylistPage";
import PersonalPlaylists from "./pages/PersonalPlaylists";
import SongPage from "./pages/SongPage";
import { AddToPlaylistPage } from "./components/AddToPlaylistToFeed";
import AddSongToPlaylistPage from "./components/AddSongToPlaylist";
import AddSongPage from "./components/AddSongPage";
import PlaylistFeed from "./pages/PlaylistFeedPage";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: props.songs || [],
      playlists: props.playlists || [],
      users: props.users || [],
      genres: ["Pop", "Rock", "Jazz", "Hip Hop", "Classical", "Country"],
      authenticatedUser: null,
    };

    this.setAuthenticatedUser = this.setAuthenticatedUser.bind(this);
    this.addNewPlaylist = this.addNewPlaylist.bind(this);
    this.addSongToPlaylist = this.addSongToPlaylist.bind(this);
    this.addNewSong = this.addNewSong.bind(this);
    this.setUsers = this.setUsers.bind(this);
  }

  addSongToPlaylist(playlistId, song) {
    // Find the playlist and add the song's ID to it
    const updatedPlaylists = this.state.playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: [...playlist.songs, song.id],
        };
      }

      return playlist;
    });

    // Update the state with the new playlists
    this.setState({
      playlists: updatedPlaylists,
    });
  }

  addNewPlaylist(newPlaylist) {
    this.setState((prevState) => ({
      playlists: [...prevState.playlists, newPlaylist],
    }));
  }

  addNewSong(newSong) {
    this.setState((prevState) => ({
      songs: [...prevState.songs, newSong],
    }));
  }

  setUsers(updatedUsers) {
    this.setState({ users: updatedUsers });
  }

  setAuthenticatedUser(username, email, userId) {
    this.setState({
      authenticatedUser: { username, email, userId },
    });
  }

  render() {
    const { songs, playlists, users, genres, authenticatedUser } = this.state;

    // Set up your routes
    const router = createBrowserRouter([
      {
        path: "/",
        element: <SplashPage />,
      },
      {
        path: "/login",
        element: (
          <SplashLogin
            users={users}
            setAuthenticatedUser={this.setAuthenticatedUser}
          />
        ),
      },
      {
        path: "/register",
        element: <SplashRegister users={users} />,
      },
      {
        path: "/home",
        element: <HomePage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/profile/:userid",
        element: (
          <ProfilePage playlists={playlists} songs={songs} users={users} />
        ),
      },
      {
        path: "/playlist/:playlistid",
        element: (
          <PlaylistPage playlists={playlists} songs={songs} users={users} />
        ),
      },
      {
        path: "/my_playlists/:userId",
        element: <PersonalPlaylists users={users} />,
      },
      {
        path: "/addtoplaylist/:songid",
        element: (
          <AddSongToPlaylistPage
            playlists={playlists}
            songs={songs}
            users={users}
            addSongToPlaylist={this.addSongToPlaylist}
          />
        ),
      },
      {
        path: "/songfeed",
        element: <SongFeed playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/playlistfeed",
        element: (
          <PlaylistFeed
            playlists={playlists}
            users={users}
            setUsers={(updatedUsers) => {
              this.setState({ users: updatedUsers });
            }}
          />
        ),
      },
      {
        path: "/song/:songid",
        element: <SongPage playlists={playlists} songs={songs} users={users} />,
      },
      {
        path: "/addsong",
        element: <AddSongPage songs={songs} addNewSong={this.addNewSong} />,
      },
      {
        path: "/create_playlist",
        element: (
          <AddToPlaylistPage
            addNewPlaylist={this.addNewPlaylist}
            genres={genres}
          />
        ),
      },
      {
        path: "*",
        element: <div>404 Error - Page Not Found</div>,
      },
    ]);

    return (
      <div>
        <RouterProvider router={router} />
      </div>
    );
  }
}
