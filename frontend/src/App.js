import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import SongsFeedPage from "./pages/SongsFeedPage";
import SplashLogin from "./pages/SplashLogin";
import { SplashRegister } from "./pages/SplashRegister";
import { ProfilePage } from "./pages/ProfilePage";
import { SplashPage } from "./pages/SplashPage";
import PlaylistPage from "./pages/PlaylistPage";
import PersonalPlaylists from "./pages/PersonalPlaylists";
import SongPage from "./pages/SongPage";
import AddToPlaylistPage from "./components/AddToPlaylistToFeed";
import AddSongToPlaylistPage from "./components/AddSongToPlaylist";
import AddSongPage from "./components/AddSongPage";
import PlaylistFeed from "./pages/PlaylistFeedPage";
import AddPlaylistComment from "./components/AddPlaylistComment";

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
    this.removeSongFromPlaylist = this.removeSongFromPlaylist.bind(this);
    this.setPlaylists = this.setPlaylists.bind(this);
    this.updatePlaylistComments = this.updatePlaylistComments.bind(this);
  }

  removeSongFromPlaylist(playlistId, songId) {
    const updatedPlaylists = this.state.playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: playlist.songs.filter((id) => id !== songId), // Remove the song
        };
      }
      return playlist;
    });

    this.setState({ playlists: updatedPlaylists });
  }

  updatePlaylistComments(playlistId, updatedComments) {
    const updatedPlaylists = this.state.playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          comments: updatedComments, // Update the comments array
        };
      }
      return playlist;
    });

    this.setState({ playlists: updatedPlaylists });
  }

  addSongToPlaylist(playlistId, song) {
    // Find the playlist and ensure that 'songs' is initialized as an array
    const updatedPlaylists = this.state.playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        // Ensure 'songs' is initialized to an array if it's undefined
        const songs = playlist.songs || [];
        return {
          ...playlist,
          songs: [...songs, song.id], // Safely spread the existing songs
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
    // Get the authenticated user's ID
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("No authenticated user");
      return;
    }

    // Update global playlists
    this.setState((prevState) => ({
      playlists: [...prevState.playlists, newPlaylist],
    }));

    // Find the authenticated user in the users array
    const updatedUsers = this.state.users.map((user) => {
      if (user.userId === parseInt(userId)) {
        // Add the new playlist to the authenticated user's playlists
        return {
          ...user,
          playlists: [...(user.playlists || []), newPlaylist],
        };
      }
      return user;
    });

    // Update the users state
    this.setState({ users: updatedUsers });
  }

  addNewSong(newSong) {
    this.setState((prevState) => ({
      songs: [...prevState.songs, newSong],
    }));
  }

  setPlaylists(updatedPlaylists) {
    this.setState({ playlists: updatedPlaylists });
  }

  setUsers(updatedUsers) {
    this.setState({ users: updatedUsers });
  }

  setAuthenticatedUser(username, email, userId) {
    this.setState({
      authenticatedUser: { username, email, userId },
    });

    localStorage.setItem(
      "authenticatedUser",
      JSON.stringify({ username, email, userId })
    );
  }

  componentDidMount() {
    const storedUser = localStorage.getItem("authenticatedUser");
    if (storedUser) {
      this.setState({
        authenticatedUser: JSON.parse(storedUser),
      });
    }
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
          <PlaylistPage
            playlists={this.state.playlists}
            songs={this.state.songs}
            users={this.state.users}
            removeSongFromPlaylist={this.removeSongFromPlaylist}
            updatePlaylistComments={this.updatePlaylistComments}
          />
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
        element: (
          <SongsFeedPage playlists={playlists} songs={songs} users={users} />
        ),
      },
      {
        path: "/playlistfeed",
        element: (
          <PlaylistFeed
            playlists={playlists}
            users={users}
            setUsers={this.setUsers}
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
        path: "/addcomment/:playlistid",
        element: (
          <AddPlaylistComment
            playlists={playlists}
            setPlaylists={this.setPlaylists}
            users={users}
          />
        ),
      },
      {
        path: "/create_playlist",
        element: (
          <AddToPlaylistPage
            genres={genres}
            addNewPlaylist={this.addNewPlaylist}
            users={users}
            setUsers={this.setUsers}
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
