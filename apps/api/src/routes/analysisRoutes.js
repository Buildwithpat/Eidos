const express = require("express");
const router = express.Router();

const {
  createAnalysis,
  getAnalyses,
} = require("../controllers/analysisController");

router.post("/create", createAnalysis);
router.get("/all", getAnalyses);

module.exports = router;
