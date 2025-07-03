const axios = require('axios');
const parseXML = require('../utils/xmlParser');
const jobQueue = require('../queues/jobQueue');

const feedUrls = [
  'https://jobicy.com/?feed=job_feed',
  'https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time',
  'https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=copywriting',
  'https://jobicy.com/?feed=job_feed&job_categories=business',
  'https://jobicy.com/?feed=job_feed&job_categories=management',
  'https://www.higheredjobs.com/rss/articleFeed.cfm',
];

async function fetchAndQueueJobs() {
  for (const url of feedUrls) {
    try {
      console.log(`🌍 Fetching from: ${url}`);

      const { data: xmlData } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const jsonData = await parseXML(xmlData);
      const items = jsonData.rss?.channel?.item || [];

      // ✅ Convert jobs to Bull-compatible format
      const bulkJobs = items.map((job, index) => ({
        name: 'import-job',
        data: { job, sourceUrl: url, totalCount: items.length, isLast: index === items.length -1 }
      }));

      // ✅ Queue all jobs at once
      await jobQueue.addBulk(bulkJobs);

      console.log(`✅ Queued ${bulkJobs.length} jobs from ${url}`);
    } catch (err) {
      console.error(`❌ Failed to fetch or queue jobs from ${url}`);
      console.error(err.message);
    }
  }
}

module.exports = fetchAndQueueJobs;