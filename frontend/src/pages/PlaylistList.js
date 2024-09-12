import React from "react";
import { Link } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

export class PlaylistList extends React.Component {
  render() {
    return (
      <div>
        <h1>Playlist List Page</h1>
        {this.props.playlists.map((playlist, i) => (
          <div key={playlist.id} className="card" style={{ width: "18rem" }}>
            <img
              src={DefaultImage}
              className="card-img-top"
              alt="Default Cover"
            />
            <div className="card-body">
              <h5 className="card-title">{playlist.name}</h5>
              <h6 className="card-subtitle mb-2 text-body-secondary">
                Hashtags:{" "}
                {playlist.hashtags && playlist.hashtags.length > 0
                  ? playlist.hashtags.map((hashtag, i) =>
                      i < playlist.hashtags.length - 1
                        ? `${hashtag}, `
                        : hashtag
                    )
                  : "No hashtags"}
              </h6>
              <p className="card-text">
                {playlist.description
                  ? playlist.description
                  : "No description available."}
              </p>
              <Link className="btn btn-primary" to={`/playlist/${playlist.id}`}>
                Go To Playlist
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
