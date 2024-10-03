import React from "react";
import { Link } from "react-router-dom";

const FriendsList = ({ users, currentUser }) => {
  const userFriends = currentUser.friends || [];

  return (
    <>
      <h3>Friends</h3>
      <ul className="list-group">
        {userFriends.map((friendId) => {
          const friend = users.find((user) => user.userId === friendId);
          return friend ? (
            <li key={friend.userId} className="list-group-item">
              <img
                src={friend.profilePic}
                alt="Friend"
                className="rounded-circle"
                width="40"
              />
              <Link to={`/profile/${friend.userId}`}>{friend.username}</Link>
            </li>
          ) : null;
        })}
      </ul>
    </>
  );
};

export default FriendsList;
