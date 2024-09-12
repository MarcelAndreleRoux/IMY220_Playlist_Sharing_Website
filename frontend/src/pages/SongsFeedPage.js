import React from "react";
import { Link } from "react-router-dom";
import SpotifyEmbed from "../components/SpotifyEmbed";
import { NavBar } from "../components/NavBar";

class SongsFeedPage extends React.Component {
  render() {
    const { songs } = this.props;

    return (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="row">
            {songs.map((song) => (
              <div key={song.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <SpotifyEmbed songLink={song.link} />

                    <Link
                      to={`/song/${song.id}`}
                      className="btn btn-secondary m-3"
                    >
                      Go to Song Page
                    </Link>

                    <Link
                      to={`/addtoplaylist/${song.id}`}
                      className="btn btn-primary m-3"
                    >
                      Add to Playlist
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link to="/addsong" className="add-song-btn">
          Add Song
        </Link>

        <style>{`
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
        `}</style>
      </>
    );
  }
}

export default SongsFeedPage;
