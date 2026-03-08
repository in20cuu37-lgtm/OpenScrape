const express = require('express');
const { scrapePage } = require('./scraper');
const { extractData } = require('./extractor');

const app = express();
app.use(express.json());

const validApiKey = 'ops_123456'; // hardcoded for demo purposes

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || !apiKey.startsWith('ops_') || apiKey !== validApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
};

app.post('/api/scrape', authMiddleware, async (req, res) => {
  try {
    const config = req.body;
    const results = [];
    for (const url of config.urls) {
      console.log(`Scraping ${url}...`);
      const html = await scrapePage(url, config.screenshots?.enabled, config.screenshots?.dir);
      const data = extractData(html, config.selectors);
      results.push({ url, ...data });
      await new Promise(resolve => setTimeout(resolve, config.delay || 1000));
    }
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('API server running on port 3000'));

module.exports = app;
