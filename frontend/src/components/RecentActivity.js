import React from "react";
import { Link } from "react-router-dom";

const RecentActivity = ({ currentUser }) => {
  return (
    <>
      <h3>Recent Activity</h3>
      {currentUser.comments && currentUser.comments.length > 0 ? (
        <ul className="list-group">
          {currentUser.comments.map((comment) => (
            <li key={comment.id} className="list-group-item">
              <p>{comment.text}</p>
              <Link to={`/playlist/${comment.playlistId}`}>View Playlist</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activity.</p>
      )}
    </>
  );
};

export default RecentActivity;
