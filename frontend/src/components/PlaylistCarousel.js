import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Music, Calendar, Hash } from "lucide-react";
import { Link } from "react-router-dom";

const PlaylistCarousel = ({ playlists }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort playlists by creation date
  const sortedPlaylists = [...playlists].sort(
    (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
  );

  const next = () => {
    if (currentIndex + 3 < sortedPlaylists.length) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (!playlists.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col items-center py-8 text-gray-500">
          <Music className="w-12 h-12 mb-4" />
          <p>No playlists created yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200 p-6">
        <h3 className="text-xl font-bold">Recent Playlists</h3>
      </div>

      <div className="relative p-6">
        <div className="flex items-center">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className={`absolute left-2 z-10 p-2 rounded-full bg-white shadow-lg ${
              currentIndex === 0
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-6 transition-transform duration-300 overflow-hidden mx-8">
            {sortedPlaylists
              .slice(currentIndex, currentIndex + 3)
              .map((playlist) => (
                <Link
                  key={playlist._id}
                  to={`/playlist/${playlist._id}`}
                  className="flex-none w-[calc(33.333%-1rem)] group"
                >
                  <div className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                    <div className="aspect-square relative">
                      <img
                        src={
                          playlist.coverImage || "/default-playlist-cover.png"
                        }
                        alt={playlist.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 p-4 text-white">
                        <h4 className="font-bold truncate">{playlist.name}</h4>
                        <p className="text-sm opacity-90">{playlist.genre}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(playlist.creationDate).toLocaleDateString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {playlist.hashtags?.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                          >
                            <Hash className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          <button
            onClick={next}
            disabled={currentIndex + 3 >= sortedPlaylists.length}
            className={`absolute right-2 z-10 p-2 rounded-full bg-white shadow-lg ${
              currentIndex + 3 >= sortedPlaylists.length
                ? "text-gray-300"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from(
            { length: Math.ceil(sortedPlaylists.length / 3) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * 3)}
                className={`w-2 h-2 rounded-full transition-all ${
                  Math.floor(currentIndex / 3) === i
                    ? "bg-blue-600 w-4"
                    : "bg-gray-300"
                }`}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCarousel;
