const express = require("express");
const router = express.Router();

const {
  saveComponent,
  getComponents,
} = require("../controllers/componentController");

router.post("/", saveComponent);
router.get("/", getComponents);

module.exports = router;
