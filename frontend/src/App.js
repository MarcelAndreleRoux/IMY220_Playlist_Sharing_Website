import React, { useState, useEffect, useContext } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { PlaylistContext } from "./context/PlaylistContext";
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

export const App = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch songs, playlists, and users concurrently
        const [songsResponse, playlistsResponse, usersResponse] =
          await Promise.all([
            fetch("/api/songs", { method: "GET" }),
            fetch("/api/playlists", { method: "GET" }),
            fetch("/api/users", { method: "GET" }),
          ]);

        // Check for errors in the songs API call
        if (!songsResponse.ok) {
          throw new Error(`Error fetching songs: ${songsResponse.statusText}`);
        }

        // Check for errors in the playlists API call
        if (!playlistsResponse.ok) {
          throw new Error(
            `Error fetching playlists: ${playlistsResponse.statusText}`
          );
        }

        // Check for errors in the users API call
        if (!usersResponse.ok) {
          throw new Error(`Error fetching users: ${usersResponse.statusText}`);
        }

        // Parse the JSON responses
        const [songsData, playlistsData, usersData] = await Promise.all([
          songsResponse.json(),
          playlistsResponse.json(),
          usersResponse.json(),
        ]);

        // Set the state with fetched data
        setSongs(songsData.songs);
        setPlaylists(playlistsData.playlists);
        setUsers(usersData.users);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        // Catch any errors and log them
        console.error("Error fetching data:", error);
        setError(`Failed to fetch data: ${error.message}`);
        setLoading(false); // Stop loading even if there’s an error
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []);

  const PrivateRoute = ({ element }) => {
    const { authenticatedUser } = useContext(PlaylistContext);

    // Wait until authenticatedUser state is determined
    if (authenticatedUser === undefined) {
      return <div>Loading...</div>;
    }

    // Redirect to login if not authenticated
    if (!authenticatedUser) {
      return <Navigate to="/login" replace />;
    }

    // Render the requested element if authenticated
    return element;
  };

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
      element: <PrivateRoute element={<HomePage />} />,
    },
    {
      path: "/profile/:username",
      element: <PrivateRoute element={<ProfilePage />} />,
    },
    {
      path: "/edit_profile/:username",
      element: <PrivateRoute element={<EditProfile />} />,
    },
    {
      path: "/playlist/:playlistid",
      element: <PrivateRoute element={<PlaylistPage />} />,
    },
    {
      path: "/my_playlists/:username",
      element: <PrivateRoute element={<PersonalPlaylists />} />,
    },
    {
      path: "/addtoplaylist/:songid",
      element: <PrivateRoute element={<AddSongToPlaylistPage />} />,
    },
    {
      path: "/songfeed",
      element: <PrivateRoute element={<SongsFeedPage />} />,
    },
    {
      path: "/playlistfeed",
      element: <PrivateRoute element={<PlaylistFeedPage />} />,
    },
    {
      path: "/create_playlist",
      element: <PrivateRoute element={<AddToPlaylistPage />} />,
    },
    {
      path: "/song/:songid",
      element: <PrivateRoute element={<SongPage />} />,
    },
    {
      path: "/addsong",
      element: <PrivateRoute element={<AddSongPage />} />,
    },
    {
      path: "/edit_playlist/:playlistid",
      element: <PrivateRoute element={<EditPlaylist />} />,
    },
    {
      path: "/addcomment/:playlistid",
      element: <PrivateRoute element={<AddPlaylistComment />} />,
    },
    {
      path: "*",
      element: <div>404 Error - Page Not Found</div>,
    },
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PlaylistProvider songs={songs} playlists={playlists} users={users}>
      <RouterProvider router={router} />
    </PlaylistProvider>
  );
};
