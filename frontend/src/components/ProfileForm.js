import React from "react";
import ProfilePictureUploader from "./ProfilePictureUploader";
import PasswordChangeSection from "./PasswordChangeSection ";

const ProfileForm = ({
  profileData,
  setProfileData,
  handleSaveChanges,
  error,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveChanges(profileData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          className="form-control"
          id="username"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <PasswordChangeSection
        password={profileData.password}
        confirmPassword={profileData.confirmPassword}
        handleInputChange={handleInputChange}
      />

      <ProfilePictureUploader
        profilePic={profileData.profilePic}
        setProfilePic={(imageUrl) =>
          setProfileData((prevData) => ({ ...prevData, profilePic: imageUrl }))
        }
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary">
        Save Changes
      </button>
    </form>
  );
};

export default ProfileForm;
