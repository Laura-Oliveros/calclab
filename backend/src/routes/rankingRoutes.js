const express = require("express");
const router = express.Router();

const { saveScore, topScores } = require("../controllers/rankingController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/top", topScores);
router.post("/", authMiddleware, saveScore);

module.exports = router;