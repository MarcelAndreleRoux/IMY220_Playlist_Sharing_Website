import React from "react";
import { Link } from "react-router-dom";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";
import SightLogo from "../../public/assets/images/Muzik_Full_Logo.png";

export class NavBar extends React.Component {
  render() {
    const { user } = this.props;

    return (
      <nav>
        <Link to="/home">
          <img width="100%" height="50px" src={SightLogo} alt="home_logo" />
        </Link>
        <Link to="/songfeed">Songs Feed</Link>
        <Link to="/playlistfeed">Playlists Feed</Link>
        <Link to={`/myplaylist/${user.userId}`}>My Playlist</Link>

        <Link to={`/profile/${user.userId}`} className="btn btn-danger">
          <img
            width="100%"
            height="50px"
            src={DefaultProfileImage}
            alt="default_image"
          />
        </Link>

        <Link to="/login" className="btn btn-danger">
          Logout
        </Link>
      </nav>
    );
  }
}
