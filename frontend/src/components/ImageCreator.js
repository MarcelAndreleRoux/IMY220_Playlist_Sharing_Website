import React from "react";
import DefaultProfileImage from "../../public/assets/images/profile_image_default.jpg";

function Header() {
  return <img src={DefaultProfileImage} alt={DefaultProfileImage} />;
}

export default Header;
