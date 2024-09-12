// Show playlist image, name, artist
// Fast Add Playlist Button to add playlist to your own
// Clickable card -> PlaylistPage

import React from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { NavBar } from "../components/NavBar";

export class PlaylistFeed extends React.Component {
  handleFastAdd = (playlist) => {
    const userId = localStorage.getItem("userId");
    const currentUser = this.props.users.find(
      (user) => user.userId === parseInt(userId)
    );

    if (currentUser) {
      // Check if playlist is already in user's playlists
      const alreadyInPlaylists = currentUser.playlists.some(
        (pl) => pl.id === playlist.id
      );

      if (!alreadyInPlaylists) {
        // Update the user's playlist and setUsers
        const updatedUser = {
          ...currentUser,
          playlists: [
            ...currentUser.playlists,
            { ...playlist, likedByUser: true },
          ],
        };

        const updatedUsers = this.props.users.map((user) =>
          user.userId === parseInt(userId) ? updatedUser : user
        );

        this.props.setUsers(updatedUsers);
      } else {
        alert("Playlist is already in your personal playlists.");
      }
    } else {
      alert("User not found.");
    }
  };

  render() {
    const { playlists } = this.props;

    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="row">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="col-md-4 mb-4">
                <div className="card">
                  <Link to={`/playlist/${playlist.id}`}>
                    <img
                      src={playlist.coverImage || DefaultImage}
                      className="card-img-top"
                      alt={playlist.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{playlist.name}</h5>
                      <p className="card-text">
                        By {playlist.artist || "Unknown"}
                      </p>
                    </div>
                  </Link>
                  <div className="card-footer">
                    <button
                      className="btn btn-primary"
                      onClick={() => this.handleFastAdd(playlist)}
                    >
                      Like Playlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default PlaylistFeed;
