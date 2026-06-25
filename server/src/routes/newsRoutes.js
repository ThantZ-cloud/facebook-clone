const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

// Simple in-memory cache
let cache = {
  data: null,
  fetchedAt: null,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper: fetch URL using curl (workaround for WSL2 Node.js fetch issues)
const fetchWithCurl = (url) => {
  return new Promise((resolve, reject) => {
    exec(`curl -s "${url}"`, { timeout: 10000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`curl failed: ${error.message}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch (e) {
        reject(new Error(`Invalid JSON from curl: ${e.message}`));
      }
    });
  });
};

// @desc    Get mixed news from GNews API
// @route   GET /api/news
// @access  Public
router.get('/', async (req, res) => {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey || apiKey === 'your_gnews_api_key_here') {
      return res.status(500).json({
        success: false,
        error: 'GNews API key not configured. Add GNEWS_API_KEY to server/.env'
      });
    }

    // Check if cache is still fresh
    const now = Date.now();
    if (cache.data && cache.fetchedAt && (now - cache.fetchedAt < CACHE_DURATION)) {
      return res.json({
        success: true,
        data: cache.data,
        cached: true
      });
    }

    console.log('Fetching fresh news from GNews API...');

    // Fetch from GNews API — 3 different queries to get mixed news
    const categories = [
      { url: `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=5&apikey=${apiKey}`, label: 'Tech' },
      { url: `https://gnews.io/api/v4/search?q=artificial+intelligence+OR+AI&lang=en&max=5&apikey=${apiKey}`, label: 'AI' },
      { url: `https://gnews.io/api/v4/search?q=myanmar+news&lang=en&max=5&apikey=${apiKey}`, label: 'Myanmar' },
    ];

    // Fetch all categories in parallel using curl
    const results = await Promise.allSettled(
      categories.map(async (cat) => {
        const data = await fetchWithCurl(cat.url);
        return {
          category: cat.label,
          articles: data.articles || []
        };
      })
    );

    // Combine all articles from successful requests
    let allArticles = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.articles) {
        allArticles.push(...result.value.articles);
      } else if (result.status === 'rejected') {
        console.error('Category fetch failed:', result.reason?.message);
      }
    }

    console.log(`Fetched ${allArticles.length} articles total`);

    // Shuffle the articles so categories are mixed
    for (let i = allArticles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allArticles[i], allArticles[j]] = [allArticles[j], allArticles[i]];
    }

    // Limit to 15 articles total
    allArticles = allArticles.slice(0, 15);

    // Update cache
    cache.data = allArticles;
    cache.fetchedAt = now;

    res.json({
      success: true,
      data: allArticles,
      cached: false
    });
  } catch (error) {
    console.error('Fetch news error:', error);

    // If we have cached data, return it even if stale
    if (cache.data) {
      return res.json({
        success: true,
        data: cache.data,
        cached: true,
        stale: true
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error fetching news'
    });
  }
});

module.exports = router;
