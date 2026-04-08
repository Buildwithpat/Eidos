const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ FIXED STATIC SERVING
// This ensures that no matter where you run the script from, it finds the folder
const screenshotsPath = path.resolve(__dirname, "..", "screenshots");
app.use("/screenshots", express.static(screenshotsPath));

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

const userRoutes = require("./routes/userRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

app.use("/user", userRoutes);
app.use("/analysis", analysisRoutes);

app.get("/", (req, res) => {
  res.send("Eidos API running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving screenshots from: ${screenshotsPath}`);
});
