const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    title: String,
    company: String,
    location: String,
    description: String,
    url: String,
    postedAt: Date,
    category: String,
    type: String,
    rawData: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
