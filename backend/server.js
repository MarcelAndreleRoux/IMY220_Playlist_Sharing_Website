// server.js
import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import multer from "multer";
import { MongoClient, ObjectId } from "mongodb";
import "regenerator-runtime/runtime";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(express.static("./frontend/public"));

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir;
    // Determine directory based on upload type
    if (req.path.includes("/comment")) {
      dir = "./frontend/public/assets/uploads/comments";
    } else if (req.path.includes("/profile")) {
      dir = "./frontend/public/assets/uploads/profiles";
    } else {
      dir = "./frontend/public/assets/uploads/playlists";
    }

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let prefix;
    if (req.path.includes("/comment")) {
      prefix = "comment-";
    } else if (req.path.includes("/profile")) {
      prefix = "profile-";
    } else {
      prefix = "playlist-";
    }
    cb(null, `${prefix}${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        "Only .png, .jpg, .jpeg and .gif files are allowed!"
      );
      error.code = "INCORRECT_FILETYPE";
      return cb(error, false);
    }

    cb(null, true);
  },
});

const username = "u22598805";
const password = "IMADETHIS1234";

// MongoDB Connection URI
const uri = `mongodb+srv://${username}:${password}@imy220.f7q7o.mongodb.net/?retryWrites=true&w=majority&appName=IMY220`;

// Create a new MongoClient
const client = new MongoClient(uri);
const dbName = "IMY200_Project";

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
  }
}

async function getNextSequenceValue(sequenceName) {
  const database = client.db(dbName);
  const sequencesCollection = database.collection("sequences");

  const sequenceDocument = await sequencesCollection.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  return sequenceDocument.sequence_value;
}

// --------------------------------------------------- CRUD ---------------------------------------------------

// CREATE
async function runInsertQuery(collectionName, document) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.insertOne(document);
    return result;
  } catch (error) {
    console.error(`Error fetching from ${collectionName}:`, error);
    throw error;
  }
}

// READ
async function runFindQuery(collectionName, query, options) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const cursor = collection.find(query, options);
    return await cursor.toArray();
  } catch (error) {
    console.error(`Error fetching from ${collectionName}:`, error);
    throw error;
  }
}

// UPDATE
async function runUpdateQuery(collectionName, filter, updateDoc) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.updateOne(filter, updateDoc);

    return result;
  } catch (error) {
    console.error(`Error updating in ${collectionName}:`, error);
    throw error;
  }
}

// DELETE
async function runDeleteQuery(collectionName, filter) {
  try {
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    const result = await collection.deleteOne(filter);
    return result;
  } catch (error) {
    console.error(`Error fetching from ${collectionName}:`, error);
    throw error;
  }
}

//Adding custom user id

// ---------------------------------------------- API Routes ---------------------------------------------

// ---------------------------- USERS ------------------------------

// GET: Retrieve all users
app.get("/api/users", async (req, res) => {
  try {
    const results = await runFindQuery("users", {}, {});

    // Count the number of users
    const userCount = results.length;

    // Respond with the count and the list of users
    res.json({ count: userCount, users: results });
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST: Login Endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await runFindQuery("users", { email, password }, {});

    if (user.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user[0];
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Create a new user
app.post("/api/users", async (req, res) => {
  try {
    // Create new user with MongoDB _id
    const result = await runInsertQuery("users", {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      friends: [],
      playlists: [],
      created_playlists: [],
      profilePic:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    });

    // Return the created user without password
    const { password: _, ...userWithoutPassword } = result;
    res
      .status(201)
      .json({ message: "User added!", result: userWithoutPassword });
  } catch (error) {
    console.error("Error posting users:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET: Retrieve a user by id
app.get("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await runFindQuery("users", { _id: new ObjectId(id) }, {});

    if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH: Update a user by id
app.patch("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { $set: req.body };

    const result = await runUpdateQuery(
      "users",
      { _id: new ObjectId(id) },
      updateData
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      // Get the updated user to return in response
      const updatedUser = await runFindQuery(
        "users",
        { _id: new ObjectId(id) },
        {}
      );
      res.json({ message: "User updated!", result: updatedUser[0] });
    }
  } catch (error) {
    console.error("Error patching user:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a user by id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runDeleteQuery("users", { _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted!", result });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------- SONGS ------------------------------

// GET: Retrieve all songs
app.get("/api/songs", async (req, res) => {
  try {
    const results = await runFindQuery("songs", {}, {});

    // Count the number of songs
    const songsCount = results.length;

    // Respond with the count and the list of songs
    res.json({ count: songsCount, songs: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new song
app.post("/api/songs", async (req, res) => {
  try {
    const { name, artist, link, creatorId } = req.body;
    const database = client.db(dbName);
    const collection = database.collection("songs");

    // Check if song with the same link already exists
    const existingSong = await collection.findOne({ link });

    if (existingSong) {
      if (existingSong.isDeleted) {
        // If the song exists but is deleted, restore it
        const updatedSong = await collection.findOneAndUpdate(
          { _id: existingSong._id },
          { $set: { isDeleted: false, name, artist } },
          { returnDocument: "after" }
        );
        res.status(200).json({
          message: "Song restored!",
          result: updatedSong.value,
        });
      } else {
        res.status(409).json({ message: "Song already exists!" });
      }
    } else {
      // Create new song
      const newSong = {
        name,
        artist,
        link,
        creatorId,
        addedToPlaylistsCount: 0,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      };

      const result = await collection.insertOne(newSong);
      // Fetch the inserted document
      const insertedSong = await collection.findOne({ _id: result.insertedId });
      res.status(201).json({
        message: "Song added!",
        result: insertedSong,
      });
    }
  } catch (error) {
    console.error("Error posting song:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET: Retrieve a song by id
app.get("/api/songs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runFindQuery("songs", { _id: new ObjectId(id) }, {});
    if (result.length === 0) {
      res.status(404).json({ message: "Song not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error("Error retrieving song:", error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH: Update a song by id
app.patch("/api/songs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { $set: req.body };
    const result = await runUpdateQuery(
      "songs",
      { _id: new ObjectId(id) },
      updateData
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Song not found" });
    } else {
      res.json({ message: "Song updated!", result });
    }
  } catch (error) {
    console.error("Error updating song:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete song by id
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runDeleteQuery("songs", { _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Song not found" });
    } else {
      res.json({ message: "Song deleted!", result });
    }
  } catch (error) {
    console.error("Error deleting song:", error);
    res.status(500).json({ message: error.message });
  }
});

// ---------------------------- PLAYLISTS ------------------------------

// GET: Retrieve all playlists
app.get("/api/playlists", async (req, res) => {
  try {
    const results = await runFindQuery("playlists", {}, {});

    // Count the number of songs
    const playlistsCount = results.length;

    // Respond with the count and the list of songs
    res.json({ count: playlistsCount, playlists: results });
  } catch (error) {
    console.error("Error retrieving playlists:", error);
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new playlist
app.post("/api/playlists", async (req, res) => {
  try {
    const newPlaylist = req.body;

    // Set default values
    newPlaylist.songs = [];
    newPlaylist.comments = [];
    newPlaylist.followers = [newPlaylist.creatorId];
    newPlaylist.creationDate = new Date().toISOString();

    const database = client.db(dbName);
    const collection = database.collection("playlists");

    // Insert the playlist
    const insertResult = await collection.insertOne(newPlaylist);

    // Fetch the complete inserted document
    const insertedPlaylist = await collection.findOne({
      _id: insertResult.insertedId,
    });

    res
      .status(201)
      .json({ message: "Playlist added!", result: insertedPlaylist });
  } catch (error) {
    console.error("Error posting playlists:", error);
    res.status(400).json({ message: error.message });
  }
});

// TEMPERARY UPLOAD
app.post(
  "/api/playlists/temp/image",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = `/assets/uploads/playlists/${req.file.filename}`;
      res.json({ message: "Image uploaded!", imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// ADD NEW PLAYLIST IMAGE
app.patch(
  "/api/playlists/:id/image",
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.params.id;

      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imageUrl = `/assets/uploads/playlists/${req.file.filename}`;

      const result = await runUpdateQuery(
        "playlists",
        { _id: new ObjectId(id) },
        { $set: { coverImage: imageUrl } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      const updatedPlaylist = await runFindQuery(
        "playlists",
        { _id: new ObjectId(id) },
        {}
      );
      res.json({ message: "Image updated!", result: updatedPlaylist[0] });
    } catch (error) {
      console.error("Error updating playlist image:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// ADD PATCH FOR NEW COMMENT
app.patch(
  "/api/playlists/:id/comment",
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const commentData = JSON.parse(req.body.comment);

      let imageUrl = null;
      if (req.file) {
        // Update image URL to match your public assets path
        imageUrl = `/assets/uploads/comments/${req.file.filename}`;
      }

      const playlist = await runFindQuery(
        "playlists",
        { _id: new ObjectId(id) },
        {}
      );
      if (!playlist[0]) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      const newComment = {
        ...commentData,
        _id: new ObjectId(),
        image: imageUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
        likedBy: [],
      };

      const updatedComments = [...(playlist[0].comments || []), newComment];

      const result = await runUpdateQuery(
        "playlists",
        { _id: new ObjectId(id) },
        { $set: { comments: updatedComments } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Playlist not found" });
      }

      const updatedPlaylist = await runFindQuery(
        "playlists",
        { _id: new ObjectId(id) },
        {}
      );
      res.json({ message: "Comment added!", result: updatedPlaylist[0] });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(400).json({ message: error.message });
    }
  }
);

// GET: Retrieve a playlist by id
app.get("/api/playlists/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runFindQuery(
      "playlists",
      { _id: new ObjectId(id) },
      {}
    );

    if (result.length === 0) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error("Error retrieving playlist:", error);
    res.status(500).json({ message: error.message });
  }
});

// In server.js, update the PATCH endpoint for playlists
app.patch("/api/playlists/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { $set: req.body };

    const result = await runUpdateQuery(
      "playlists",
      { _id: new ObjectId(id) },
      updateData
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      const updatedPlaylist = await runFindQuery(
        "playlists",
        { _id: new ObjectId(id) },
        {}
      );
      res.json({ message: "Playlist updated!", result: updatedPlaylist[0] });
    }
  } catch (error) {
    console.error("Error patching playlist:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete playlist by id
app.delete("/api/playlists/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runDeleteQuery("playlists", { _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      res.json({ message: "Playlist deleted!", result });
    }
  } catch (error) {
    console.error("Error deleting playlist:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./frontend/public/index.html"));
});

// Start the server
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${PORT}/`);
});
