const express = require("express");
const router = express.Router();

const { inspectElement } = require("../controllers/inspectController");

router.post("/", inspectElement);

module.exports = router;
