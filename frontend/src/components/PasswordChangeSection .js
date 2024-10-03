import React from "react";

const PasswordChangeSection = ({
  password,
  confirmPassword,
  handleInputChange,
}) => {
  return (
    <>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          New Password (optional)
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={password}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm New Password
        </label>
        <input
          type="password"
          className="form-control"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleInputChange}
        />
      </div>
    </>
  );
};

export default PasswordChangeSection;
