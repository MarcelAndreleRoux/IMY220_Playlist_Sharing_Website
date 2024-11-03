import React from "react";

const SpotifyEmbed = ({ songLink }) => {
  if (!songLink) return <p className="text-muted">Song link unavailable</p>;

  // Extract the track ID from the song link
  const trackId = songLink.split("/track/")[1].split("?")[0];

  // Construct the embed URL
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;

  return (
    <iframe
      style={{ borderRadius: "12px" }}
      src={embedUrl}
      width="100%"
      height="152"
      frameBorder="0"
      allowFullScreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      title="Spotify Player"
    ></iframe>
  );
};

export default SpotifyEmbed;
