// where you can search for anything (song, playlits)

import React from "react";

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div class="input-group flex-nowrap">
          <span class="input-group-text" id="addon-wrapping">
            Search
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Username"
            aria-label="Username"
            aria-describedby="addon-wrapping"
          />
        </div>
      </>
    );
  }
}
