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

console.log("✅ Worker is processing jobs...");

// ✅ SETUP LOG LISTENERS FIRST (before processing begins)
jobQueue.on("waiting", (jobId) => {
  console.log(`👀 Worker sees waiting job: ${jobId}`);
});

jobQueue.on("active", (job) => {
  console.log(`⚙️ Worker started job: ${job.id}`);
});

jobQueue.on("completed", (job) => {
  console.log(`✅ Worker completed job: ${job.id}`);
});

// ✅ THEN DEFINE THE PROCESSOR
jobQueue.process('import-job',async (job) => {
  // const { job: jobData, sourceUrl, totalCount, isLast } = job.data;
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
      console.log(`♻️ Existing job updated for: ${jobId}`);
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
    console.log(`🆕 New job inserted for: ${jobId}`);
  } catch (err) {
    stats.failedJobs.push({
      reason: err.message,
      jobData,
    });
    console.error(`❌ Failed to insert/update job ${jobId}: ${err.message}`);
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
    console.log(`🟡 Last job detected for: ${sourceUrl}`);
    console.log(`✅ Import log saved for: ${sourceUrl}`);
    importStats.delete(sourceUrl);
  }
});
