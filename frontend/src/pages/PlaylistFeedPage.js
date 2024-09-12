// Show playlist image, name, artist
// Fast Add Playlist Button to add playlist to your own
// Clickable card -> PlaylistPage

import React from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";
import { NavBar } from "./NavBar";

export class PlaylistFeed extends React.Component {
  handleFastAdd = (playlist) => {
    const { addNewPlaylist } = this.props;

    // Add the playlist to user's own playlists
    addNewPlaylist({
      ...playlist,
      id: Date.now(),
    });
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
