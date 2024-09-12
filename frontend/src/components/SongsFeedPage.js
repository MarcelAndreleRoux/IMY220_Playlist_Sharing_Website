import React from "react";
import { Link } from "react-router-dom";
import { SpotifyEmbed } from "./RenderSpotifyEmber";

export class SongFeed extends React.Component {
  render() {
    const { songs } = this.props;

    return (
      <div className="song-feed">
        {songs.map((song) => (
          <div key={song.id} className="song-card">
            <Link to={`/song/${song.id}`} className="song-info">
              <h3>{song.name}</h3>
              <p>{song.artist}</p>
              <SpotifyEmbed songLink={song.link} />
            </Link>

            <Link to={`/addtoplaylist/${song.id}`} className="fast-add-button">
              <button>Add to Playlist</button>
            </Link>
          </div>
        ))}
      </div>
    );
  }
}
