const Queue = require('bull');
require('dotenv').config();

const jobQueue = new Queue('job-import-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  }
});

jobQueue.on('error', (err) => {
  console.error('❌ Redis Queue Error:', err.message);
});

module.exports = jobQueue;