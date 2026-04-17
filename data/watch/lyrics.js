const axios = require('axios');

const BASE_URL = 'https://lrclib.net/api';
const HEADERS = {
  'User-Agent': 'ApiScraper (https://github.com/user/ApiScraper)'
};

/**
 * Search for lyrics by query.
 * @param {string} query 
 * @returns {Promise<Array>}
 */
async function searchLyrics(query) {
  const { data } = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: HEADERS });
  return data;
}

/**
 * Get lyrics by specific track details.
 * @param {Object} params - { artist_name, track_name, album_name, duration }
 * @returns {Promise<Object>}
 */
async function getLyricsByDetails(params) {
  const queryParams = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/get?${queryParams}`, { headers: HEADERS });
  return data;
}

/**
 * Get lyrics by ID.
 * @param {number|string} id 
 * @returns {Promise<Object>}
 */
async function getLyricsById(id) {
  const { data } = await axios.get(`${BASE_URL}/get/${id}`, { headers: HEADERS });
  return data;
}

/**
 * Get lyrics for the first search result (simplified helper).
 * @param {string} query 
 * @returns {Promise<Object>}
 */
async function getLyrics(query) {
  const results = await searchLyrics(query);
  if (!results || results.length === 0) return { error: 'No results found.' };
  return results[0];
}

module.exports = { 
  searchLyrics, 
  getLyricsByDetails, 
  getLyricsById, 
  getLyrics 
};
