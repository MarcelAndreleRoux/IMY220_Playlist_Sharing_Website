import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const RecentActivity = ({ currentUser, playlists, songs, users }) => {
  // Get today's activities
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Create activity items for different actions
  const getPlaylistActivities = () => {
    return playlists
      .filter((playlist) => {
        const playlistDate = new Date(playlist.creationDate);
        return playlist.creatorId === currentUser._id && playlistDate >= today;
      })
      .map((playlist) => ({
        id: `playlist-${playlist._id}`,
        type: "playlist_created",
        date: new Date(playlist.creationDate),
        content: `Created playlist "${playlist.name}"`,
        link: `/playlist/${playlist._id}`,
        linkText: "View Playlist",
      }));
  };

  const getSongActivities = () => {
    return songs
      .filter((song) => {
        const songDate = new Date(song.createdAt);
        return song.creatorId === currentUser._id && songDate >= today;
      })
      .map((song) => ({
        id: `song-${song._id}`,
        type: "song_added",
        date: new Date(song.createdAt),
        content: `Added song "${song.name}" by ${song.artist}`,
        link: null,
      }));
  };

  // Combine all activities
  const allActivities = [
    ...getPlaylistActivities(),
    ...getSongActivities(),
  ].sort((a, b) => b.date - a.date);

  const getActivityIcon = (type) => {
    switch (type) {
      case "playlist_created":
        return "🎵";
      case "song_added":
        return "🎼";
      default:
        return "📝";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">Today's Activity</h3>
      {allActivities.length > 0 ? (
        <div className="space-y-4">
          {allActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="text-gray-800">{activity.content}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(activity.date, { addSuffix: true })}
                </p>
                {activity.link && (
                  <Link
                    to={activity.link}
                    className="text-blue-500 hover:underline text-sm mt-1 block"
                  >
                    {activity.linkText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No activity today.</p>
      )}
    </div>
  );
};

export default RecentActivity;
