const mongoose = require("mongoose");

const importLogSchema = new mongoose.Schema({
  timeStamp: { type: Date, default: Date.now },
  sourceUrl: String,
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [
    {
      reason: String,
      jobData: Object,
    },
  ],
});

module.exports = mongoose.model("importLog", importLogSchema);
