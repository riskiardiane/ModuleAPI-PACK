const axios = require('axios');
const BASE_URL = 'https://lrclib.net/api';
const HEADERS = {
  'User-Agent': 'ApiScraper (https://github.com/user/ApiScraper)'
};
async function searchLyrics(query) {
  const { data } = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: HEADERS });
  return data;
}
async function getLyricsByDetails(params) {
  const queryParams = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/get?${queryParams}`, { headers: HEADERS });
  return data;
}
async function getLyricsById(id) {
  const { data } = await axios.get(`${BASE_URL}/get/${id}`, { headers: HEADERS });
  return data;
}
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
