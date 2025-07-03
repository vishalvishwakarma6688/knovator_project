const axios = require('axios');

axios.get('https://jobicy.com/?feed=job_feed').then(res => {
  console.log('✅ Success:', res.data.slice(0, 300));
}).catch(err => {
  console.error('❌ Error:', err.message);
});