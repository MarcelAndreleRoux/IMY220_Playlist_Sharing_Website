import React from "react";
import { Link } from "react-router-dom";

const FriendsList = ({ users, currentUser }) => {
  // Get IDs of the user's friends
  const friendIds = currentUser.friends || [];

  // Get the full friend objects from users array
  const friendsList = users.filter((user) => friendIds.includes(user._id));

  if (friendsList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Friends</h3>
        <p className="text-gray-500 text-center">No friends yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Friends</h3>
      <div className="flex flex-wrap gap-4">
        {friendsList.map((friend) => (
          <Link
            key={friend._id}
            to={`/profile/${friend.username}`}
            className="group flex flex-col items-center w-24"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 mb-2 group-hover:border-blue-500 transition-colors">
              <img
                src={friend.profilePic || "/default-avatar.png"}
                alt={friend.username}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-center truncate w-full text-gray-700 group-hover:text-blue-500">
              {friend.username}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
