import React, { useRef } from "react";

const ProfilePictureUploader = ({ profilePic, setProfilePic }) => {
  const profilePicRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor="profilePic" className="form-label">
        Profile Picture
      </label>

      <input
        type="file"
        className="form-control"
        id="profilePic"
        ref={profilePicRef}
        onChange={handleProfilePicChange}
      />

      <img
        src={profilePic}
        alt="Profile Preview"
        width="150px"
        className="mt-3 rounded-circle"
      />
    </div>
  );
};

export default ProfilePictureUploader;
