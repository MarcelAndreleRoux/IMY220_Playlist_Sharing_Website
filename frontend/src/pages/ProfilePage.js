import React, { useContext, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PlaylistContext } from "../context/PlaylistContext";
import ImageUploader from "../components/ImageUploader";
import FriendsList from "../components/FriendsList";
import { Edit, Camera } from "lucide-react";
import NavBar from "../components/NavBar";
import PlaylistCarousel from "../components/PlaylistCarousel";

const ProfilePage = () => {
  const { username } = useParams();
  const {
    users,
    playlists,
    authenticatedUser,
    setAuthenticatedUser,
    setUsers,
  } = useContext(PlaylistContext);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
    pronouns: "",
    socialLinks: "",
  });

  useEffect(() => {
    // Find user by username
    const user = users.find((user) => user.username === username);

    if (!authenticatedUser) {
      navigate("/login");
      return;
    }

    if (user) {
      setCurrentUser(user);
      setEditForm({
        username: user.username || "",
        bio: user.bio || "",
        pronouns: user.pronouns || "",
        socialLinks: user.socialLinks || "",
      });
    }
  }, [username, users, authenticatedUser]);

  useEffect(() => {
    if (isOwnProfile && currentUser) {
      const updatedAuthUser = {
        ...authenticatedUser,
        username: currentUser.username,
      };

      setAuthenticatedUser(updatedAuthUser);

      sessionStorage.setItem(
        "authenticatedUser",
        JSON.stringify(updatedAuthUser)
      );
    }
  }, [currentUser?.username]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">
          {!authenticatedUser
            ? "Please log in to view profiles"
            : "Loading profile..."}
        </p>
        {!authenticatedUser && (
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Login
            </button>
          </Link>
        )}
      </div>
    );
  }

  const handleImageSelect = async (file) => {
    if (!file || !currentUser?._id || !isEditing) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `/api/users/${currentUser._id}/profile-picture`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update profile picture");
      }

      const { result } = await response.json();

      // Create updated user object
      const updatedUser = {
        ...currentUser,
        profilePic: result.profilePic,
      };

      // Update local user state
      setCurrentUser(updatedUser);

      // Update users list
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === currentUser._id
            ? { ...user, profilePic: result.profilePic }
            : user
        )
      );

      // Update authenticated user
      if (isOwnProfile) {
        const updatedAuthUser = {
          ...authenticatedUser,
          profilePic: result.profilePic,
        };
        setAuthenticatedUser(updatedAuthUser);
        sessionStorage.setItem(
          "authenticatedUser",
          JSON.stringify(updatedAuthUser)
        );
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const isOwnProfile = authenticatedUser?._id === currentUser?._id;
  const isFriend = authenticatedUser?.friends?.includes(currentUser?._id);

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser._id}/follow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: authenticatedUser._id }),
      });

      if (!response.ok) throw new Error("Failed to follow user");

      // Get both updated users from the response
      const { result: updatedTargetUser } = await response.json();

      // Update local states
      setCurrentUser(updatedTargetUser);

      // Update authenticated user's friends list
      const updatedAuthUser = {
        ...authenticatedUser,
        friends: [...(authenticatedUser.friends || []), currentUser._id],
      };
      setAuthenticatedUser(updatedAuthUser);
      sessionStorage.setItem(
        "authenticatedUser",
        JSON.stringify(updatedAuthUser)
      );

      // Update users list
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id === currentUser._id) return updatedTargetUser;
          if (user._id === authenticatedUser._id) return updatedAuthUser;
          return user;
        })
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser._id}/unfollow`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: authenticatedUser._id }),
      });

      if (!response.ok) throw new Error("Failed to unfollow user");

      const { result: updatedTargetUser } = await response.json();

      // Update local states
      setCurrentUser(updatedTargetUser);

      // Update authenticated user's friends list
      const updatedAuthUser = {
        ...authenticatedUser,
        friends: (authenticatedUser.friends || []).filter(
          (id) => id !== currentUser._id
        ),
      };
      setAuthenticatedUser(updatedAuthUser);
      sessionStorage.setItem(
        "authenticatedUser",
        JSON.stringify(updatedAuthUser)
      );

      // Update users list
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id === currentUser._id) return updatedTargetUser;
          if (user._id === authenticatedUser._id) return updatedAuthUser;
          return user;
        })
      );
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${currentUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const { result } = await response.json();
      setCurrentUser(result);

      if (isOwnProfile) {
        setAuthenticatedUser(result);
        sessionStorage.setItem("authenticatedUser", JSON.stringify(result));

        if (result.username !== username) {
          navigate(`/profile/${result.username}`);
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const userPlaylists = playlists.filter(
    (playlist) => playlist.creatorId === currentUser._id
  );

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="relative w-48 h-48 mx-auto mb-6">
                {isEditing ? (
                  <ImageUploader
                    currentImage={currentUser.profilePic}
                    onImageSelect={handleImageSelect}
                    className="w-full h-full rounded-full"
                    isCircular={true}
                  />
                ) : (
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gray-200">
                    <img
                      src={currentUser.profilePic || "/default-avatar.png"}
                      alt={`${currentUser.username}'s profile`}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center" }}
                    />
                    {isOwnProfile && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        onClick={() => setIsEditing(true)}
                      >
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmitEdit} className="space-y-4">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Username"
                  />
                  <input
                    type="text"
                    value={editForm.pronouns}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        pronouns: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Pronouns"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Bio"
                    rows="3"
                  />
                  <input
                    type="text"
                    value={editForm.socialLinks}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        socialLinks: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Social Links"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    {currentUser.username}
                  </h2>
                  {currentUser.pronouns && (
                    <p className="text-gray-600 mb-2">{currentUser.pronouns}</p>
                  )}
                  {currentUser.bio && (
                    <p className="text-gray-700 mb-4">{currentUser.bio}</p>
                  )}
                  {currentUser.socialLinks && (
                    <p className="text-blue-500 hover:underline">
                      {currentUser.socialLinks}
                    </p>
                  )}

                  {isOwnProfile ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={isFriend ? handleUnfollow : handleFollow}
                      className={`mt-4 w-full px-4 py-2 rounded transition-colors ${
                        isFriend
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isFriend ? "Unfollow" : "Follow"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            {(isOwnProfile || isFriend) && (
              <>
                <FriendsList users={users} currentUser={currentUser} />
                <PlaylistCarousel playlists={userPlaylists} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
