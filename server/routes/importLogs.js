const express = require("express");
const router = express.Router();
const importLogs = require("../models/ImportLog");

router.get("/", async (req, res) => {
  try {
    const log = await importLogs
      .find()
      .sort({
        timeStamp: -1,
      })
      .limit(500);
    res.json(log);
  } catch (error) {
    console.error("error in fetching logs", error.message);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
