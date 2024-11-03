import React from "react";
import { Link } from "react-router-dom";

const NoSongsMessage = ({
  message = "No songs added yet.",
  linkText = "Add A Song",
  linkTo = "/home?tab=songs",
}) => {
  return (
    <div className="container mt-5 text-center">
      <p>{message}</p>
      <Link to={linkTo} className="btn btn-primary">
        {linkText}
      </Link>
    </div>
  );
};

export default NoSongsMessage;
