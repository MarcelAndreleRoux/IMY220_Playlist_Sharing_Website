import express from "express";

const app = express();
const PORT = 3000;

app.use(express.static("frontend/public"));

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
