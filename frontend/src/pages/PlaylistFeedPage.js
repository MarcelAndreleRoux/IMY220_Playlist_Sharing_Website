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
    const userId = localStorage.getItem("userId");
    const currentUser = this.props.users.find(
      (user) => user.userId === parseInt(userId)
    );

    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="row">
            {playlists.map((playlist) => {
              // Check if playlist is already in user's playlists
              const alreadyInPlaylists = currentUser
                ? currentUser.playlists.some((pl) => pl.id === playlist.id)
                : false;

              const formattedDate = new Date(
                playlist.creationDate
              ).toLocaleDateString();

              return (
                <div key={playlist.id} className="col-md-4 mb-4">
                  <div className="card" style={{ height: "100%" }}>
                    <Link to={`/playlist/${playlist.id}`}>
                      <img
                        src={playlist.coverImage || DefaultImage}
                        className="card-img-top"
                        alt={playlist.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{playlist.name}</h5>
                        <p className="card-text">
                          By {playlist.artist || "Unknown"}
                        </p>
                        {playlist.hashtags && playlist.hashtags.length > 0 && (
                          <div>
                            <strong>Hashtags: </strong>
                            {playlist.hashtags.map((hashtag, index) => (
                              <span
                                key={index}
                                className="badge bg-secondary me-1"
                              >
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p>
                          <strong>Created on: </strong>
                          {formattedDate}
                        </p>
                      </div>
                    </Link>
                    <div className="card-footer">
                      <button
                        className="btn btn-primary"
                        onClick={() => this.handleFastAdd(playlist)}
                        disabled={alreadyInPlaylists}
                      >
                        {alreadyInPlaylists ? "Added" : "Like Playlist"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Link to="/create_playlist" className="add-song-btn">
          + Add Playlist
        </Link>

        <style jsx="true">{`
          .add-song-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 50px;
            text-align: center;
            font-size: 18px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
          }
          .add-song-btn:hover {
            background-color: #218838;
            text-decoration: none;
          }

          /* Fix card size */
          .card {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .card-body {
            flex-grow: 1;
          }
        `}</style>
      </>
    );
  }
}

export default PlaylistFeed;
