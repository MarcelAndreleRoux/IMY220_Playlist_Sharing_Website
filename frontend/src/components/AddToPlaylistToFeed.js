import React from "react";
import { NavLink } from "react-router-dom";
import DefaultImage from "../../public/assets/images/DefaultImage.jpg";

export class AddToPlaylistPage extends React.Component {
  constructor(props) {
    super(props);

    // Create refs for each form field
    this.nameRef = React.createRef();
    this.genreRef = React.createRef();
    this.coverImageRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.hashtagsRef = React.createRef();

    this.state = {
      error: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handle form submission using refs
  handleSubmit(event) {
    event.preventDefault();

    const name = this.nameRef.current.value;
    const genre = this.genreRef.current.value;
    const coverImage = this.coverImageRef.current.value;
    const description = this.descriptionRef.current.value;
    const hashtags = this.hashtagsRef.current.value;

    // Basic validation
    if (!name || !genre) {
      this.setState({
        error: "Please fill in all required fields (name and genre).",
      });
      return;
    }

    // Create a new playlist object
    const newPlaylist = {
      id: Date.now(),
      name,
      genre,
      coverImage: coverImage || DefaultImage, // Default cover image
      description: description || "No description provided.",
      hashtags: hashtags ? hashtags.split(",").map((tag) => tag.trim()) : [],
    };

    // Add new playlist to the app state
    this.props.addNewPlaylist(newPlaylist);

    // Navigate to playlist list page after creation
    window.location.href = "/playlist_list";
  }

  render() {
    const { genres } = this.props;
    const { error } = this.state;

    return (
      <div className="container mt-5">
        <h1>Create a New Playlist</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Playlist Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              ref={this.nameRef}
              placeholder="Enter playlist name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <select
              className="form-select"
              id="genre"
              ref={this.genreRef}
              required
            >
              <option value="">Select a genre</option>
              {genres.map((genre, index) => (
                <option key={index} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="coverImage" className="form-label">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              className="form-control"
              id="coverImage"
              ref={this.coverImageRef}
              placeholder="Enter image URL"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description (optional)
            </label>
            <textarea
              className="form-control"
              id="description"
              ref={this.descriptionRef}
              placeholder="Enter playlist description"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="hashtags" className="form-label">
              Hashtags (optional, separated by commas)
            </label>
            <input
              type="text"
              className="form-control"
              id="hashtags"
              ref={this.hashtagsRef}
              placeholder="e.g., #chill, #workout"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Create Playlist
          </button>
        </form>

        <NavLink to="/playlist_list" className="btn btn-link mt-3">
          Back to Playlist List
        </NavLink>
      </div>
    );
  }
}
