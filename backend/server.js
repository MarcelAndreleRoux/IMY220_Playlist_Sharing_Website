// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { MongoClient } from "mongodb";
import "regenerator-runtime/runtime";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static("./frontend/public"));

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

async function initializeSequences() {
  try {
    const database = client.db(dbName);
    const sequencesCollection = database.collection("sequences");

    // Initialize sequence counters if they don't exist
    await sequencesCollection.updateMany(
      {},
      {
        $setOnInsert: {
          _id: "userId",
          sequence_value: 4,
        },
      },
      { upsert: true }
    );

    await sequencesCollection.updateMany(
      {},
      {
        $setOnInsert: {
          _id: "songId",
          sequence_value: 5,
        },
      },
      { upsert: true }
    );

    await sequencesCollection.updateMany(
      {},
      {
        $setOnInsert: {
          _id: "playlistId",
          sequence_value: 7,
        },
      },
      { upsert: true }
    );

    console.log("Sequences initialized");
  } catch (error) {
    console.error("Error initializing sequences:", error);
  }
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
    console.error(`Error fetching from ${collectionName}:`, error);
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

// POST: Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;

    // next user ID
    const nextUserId = await getNextSequenceValue("userId");
    newUser.userId = nextUserId;

    // default values
    newUser.friends = [];
    newUser.playlists = [];
    newUser.created_playlists = [];
    newUser.profilePic =
      "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    const result = await runInsertQuery("users", newUser);
    res.status(201).json({ message: "User added!", result });
  } catch (error) {
    console.error("Error posting users:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET: Retrieve a user by id
app.get("/api/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await runFindQuery("users", { userId: parseInt(id) }, {});

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
      { userId: parseInt(id) },
      updateData
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User updated!", result });
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
    const result = await runDeleteQuery("users", { userId: parseInt(id) });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted!", result });
    }
  } catch (error) {
    console.error("Error deleting users:", error);
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
    const newSong = req.body;

    // next song ID
    const nextSongId = await getNextSequenceValue("songId");
    newSong.id = nextSongId;

    // default values
    newSong.addedToPlaylistsCount = 0;
    newSong.isDeleted = false;

    const result = await runInsertQuery("songs", newSong);
    res.status(201).json({ message: "Song added!", result });
  } catch (error) {
    console.error("Error posting song:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET: Retrieve a song by id
app.get("/api/songs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runFindQuery("songs", { id: parseInt(id) }, {});

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
      { id: parseInt(id) },
      updateData
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Song not found" });
    } else {
      res.json({ message: "Song updated!", result });
    }
  } catch (error) {
    console.error("Error patching song:", error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete song by id
app.delete("/api/songs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runDeleteQuery("songs", { id: parseInt(id) });

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

    // next playlist ID
    const nextPlaylistId = await getNextSequenceValue("playlistId");
    newPlaylist.id = nextPlaylistId;

    // default values
    newPlaylist.songs = [];
    newPlaylist.comments = [];
    newPlaylist.followers = [newPlaylist.creatorId];
    newPlaylist.creationDate = new Date().toISOString();

    const result = await runInsertQuery("playlists", newPlaylist);
    res.status(201).json({ message: "Playlist added!", result });
  } catch (error) {
    console.error("Error posting playlists:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET: Retrieve a playlist by id
app.get("/api/playlists/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await runFindQuery("playlists", { id: parseInt(id) }, {});

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

app.patch("/api/playlists/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = { $set: req.body };
    const result = await runUpdateQuery(
      "playlists",
      { id: parseInt(id) },
      updateData
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Playlist not found" });
    } else {
      res.json({ message: "Playlist updated!", result });
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
    const result = await runDeleteQuery("playlists", { id: parseInt(id) });

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
  await initializeSequences();
  console.log(`Server is running on http://localhost:${PORT}/`);
});
