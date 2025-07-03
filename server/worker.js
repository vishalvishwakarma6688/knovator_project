const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jobQueue = require("./queues/jobQueue");
const Job = require("./models/Job");
const ImportLog = require("./models/ImportLog");
const importStats = new Map();

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Worker connected to MongoDB"))
  .catch((err) => console.error("Worker DB connection error:", err));

console.log("processing job from queue");
jobQueue.process(async (job) => {
  const { job: jobData, sourceUrl, totalCount, isLast } = job.data;
  const jobId =
    jobData.guid?._ || jobData.link || jobData.id || Math.random().toString();

  if (!importStats.has(sourceUrl)) {
    importStats.set(sourceUrl, {
      totalFetched: totalCount || 0,
      totalImported: 0,
      newJobs: 0,
      updatedJobs: 0,
      failedJobs: [],
    });
  }

  if (isLast) {
    await ImportLog.create({
      timestamp: new Date(),
      sourceUrl,
      totalFetched: stats.totalFetched,
      totalImported: stats.totalImported,
      newJobs: stats.newJobs,
      updatedJobs: stats.updatedJobs,
      failedJobs: stats.failedJobs,
    });

    console.log(`📝 Saved import log for ${sourceUrl}`);
    importStats.delete(sourceUrl); // Clean up memory
  }

  const stats = importStats.get(sourceUrl);

  try {
    const existing = await Job.findOne({ jobId });

    if (existing) {
      await Job.updateOne(
        { jobId },
        {
          title: jobData.title,
          company: jobData["job:company"] || "",
          location: jobData["job:location"] || "",
          description: jobData.description || "",
          url: jobData.link || "",
          postedAt: new Date(jobData.pubDate),
          category: jobData.category || "",
          type: jobData["job:type"] || "",
          rawData: jobData,
        }
      );
      stats.updatedJobs++;
    } else {
      await Job.create({
        jobId,
        title: jobData.title,
        company: jobData["job:company"] || "",
        location: jobData["job:location"] || "",
        description: jobData.description || "",
        url: jobData.link || "",
        postedAt: new Date(jobData.pubDate),
        category: jobData.category || "",
        type: jobData["job:type"] || "",
        rawData: jobData,
      });
      stats.newJobs++;
    }

    stats.totalImported++;
  } catch (err) {
    stats.failedJobs.push({
      reason: err.message,
      jobData,
    });
  }

  // Save log to DB
  await ImportLog.create(importLog);
  console.log("Import log saved ", importLog);
});
