import React from "react";
import { Link } from "react-router-dom";

export class SplashPage extends React.Component {
  render() {
    return (
      <div className="min-h-screen bg-neutral-900 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-amber-500/20 rounded-full blur-3xl -top-20 -left-20 animate-blob" />
          <div className="absolute w-96 h-96 bg-amber-700/20 rounded-full blur-3xl top-1/3 right-1/4 animate-blob animation-delay-2000" />
          <div className="absolute w-96 h-96 bg-amber-300/20 rounded-full blur-3xl bottom-1/4 left-1/3 animate-blob animation-delay-4000" />

          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #78350f 1px, transparent 1px),
                linear-gradient(-45deg, #78350f 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center backdrop-blur-sm">
          <h1 className="text-8xl font-bold mb-4 text-amber-400 drop-shadow-lg">
            Welcome to MUZIK
          </h1>

          <p className="text-xl mb-8 text-neutral-200 max-w-2xl">
            Dive into a world where music lovers connect and share their
            favorite tunes. Whether you're into pop, rock, jazz, or classical,
            MUZIK is the place for you.
          </p>

          <p className="text-lg mb-12 text-neutral-300 max-w-2xl">
            Create your own playlists, explore those made by others, and find
            new songs that match your mood and style.
          </p>

          <h2 className="text-3xl font-bold mb-8 text-amber-500 drop-shadow-lg">
            Join us today and start your musical journey!
          </h2>

          <Link
            to="/login"
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-neutral-900 
                       font-bold rounded-lg transform transition hover:scale-105 
                       active:scale-95 shadow-lg"
          >
            Explore Now
          </Link>
        </div>
      </div>
    );
  }
}
