const axios = require('axios');
const cheerio = require('cheerio');
const BASE_URL = 'https://tv10.lk21official.cc';
const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Cache-Control': 'max-age=0',
    'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Source': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Connection': 'keep-alive'
  }
});
function checkCloudflare($) {
  if ($('title').text().includes('Just a moment...') || $('title').text().includes('Cloudflare')) {
    console.warn('⚠️ Warning: request blocked by Cloudflare verification.');
  }
}
function parseArticles(elements, $) {
  const results = [];
  elements.each((i, el) => {
    const title = $(el).find('h2, h3, .title, .poster-title').text().trim();
    let link = $(el).find('a').attr('href');
    let image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
    const rating = $(el).find('.rating').text().trim() || $(el).find('.score').text().trim();
    const quality = $(el).find('.quality').text().trim() || $(el).find('.label-HD, .label-SD, .label-HDCAM').text().trim();
    if (link && !link.startsWith('http')) {
      link = `${BASE_URL}${link}`;
    }
    if (title && link) {
      results.push({
        title,
        link,
        image,
        rating: rating ? rating.replace(' ', '') : null,
        quality: quality ? quality : null
      });
    }
  });
  return results;
}
async function getHome() {
  try {
    const { data } = await client.get('/');
    const $ = cheerio.load(data);
    checkCloudflare($);
    return {
      featured: parseArticles($('.featured .slider article, .slider article'), $),
      latestMovies: parseArticles($('.widget[data-type="latest-movies"] article'), $),
      latestSeries: parseArticles($('.widget[data-type="latest-series"] article'), $),
      topSeriesToday: parseArticles($('.widget[data-type="top-series-today"] article'), $),
      latestAction: parseArticles($('.widget[data-type="latest-action"] article'), $),
      latestHorror: parseArticles($('.widget[data-type="latest-horror"] article'), $),
      latestComedy: parseArticles($('.widget[data-type="latest-comedy"] article'), $),
      latestKorea: parseArticles($('.widget[data-type="latest-korea"] article'), $)
    };
  } catch (error) {
    console.error(`Error fetching home: ${error.message}`);
    throw error;
  }
}
async function getSearch(query) {
  try {
    const { data } = await client.get('/', { params: { s: query } });
    const $ = cheerio.load(data);
    checkCloudflare($);
    return parseArticles($('article, .item, .search-item'), $);
  } catch (error) {
    console.error(`Error searching movies: ${error.message}`);
    throw error;
  }
}
async function getFilter(options = {}) {
  try {
    const { order = 'latest', type = '', genre1 = '', genre2 = '', country = '', year = '', page = 1 } = options;
    let urlPath = `/${order}`;
    if (type && type !== 'both') urlPath += `/type/${type}`;
    if (genre1) urlPath += `/genre1/${genre1}`;
    if (genre2) urlPath += `/genre2/${genre2}`;
    if (country) urlPath += `/country/${country}`;
    if (year) urlPath += `/year/${year}`;
    if (page > 1) urlPath += `/page/${page}`;
    const { data } = await client.get(urlPath);
    const $ = cheerio.load(data);
    checkCloudflare($);
    return parseArticles($('article, .item, .search-item'), $);
  } catch (error) {
    console.error(`Error filtering movies: ${error.message}`);
    throw error;
  }
}
async function getDetail(url) {
  try {
    if (!url.startsWith('http')) {
      url = url.startsWith('/') ? `${BASE_URL}${url}` : `${BASE_URL}/${url}`;
    }
    const { data } = await client.get(url);
    const $ = cheerio.load(data);
    checkCloudflare($);
    let title = '', year = '', duration = '', rating = '', poster = '', quality = '';
    const jsonDataStr = $('#watch-history-data').html();
    if (jsonDataStr) {
      try {
        const jsonData = JSON.parse(jsonDataStr);
        title = jsonData.title || '';
        year = jsonData.year ? String(jsonData.year) : '';
        duration = jsonData.runtime || '';
        rating = jsonData.rating || '';
        poster = jsonData.poster || '';
      } catch (e) {}
    }
    if (!title) {
      title = $('.movie-info h1').text().trim().replace(/Nonton | Sub Indo di Lk21/g, '');
    }
    if (!year) {
      const yearMatch = title.match(/\((\d{4})\)/);
      if (yearMatch) year = yearMatch[1];
    }
    if (!year) {
      year = $('.movie-info h2').text().replace(/[()]/g, '').trim() || $('span[itemprop="dateCreated"]').text().trim();
    }
    if (!duration) {
      $('.info-tag span').each((i, el) => {
        const text = $(el).text().trim();
        if (/\d+h \d+m|\d+ min/.test(text)) {
          duration = text;
        }
      });
      if (!duration) duration = $('.info-tag span').last().text().trim();
    }
    if (duration && /^\d{1,2}:\d{2}$/.test(duration)) {
      const [h, m] = duration.split(':');
      duration = `${h.padStart(2, '0')}h:${m.padStart(2, '0')}m`;
    }
    if (!rating) {
      const ratingMatch = $('.info-tag').text().match(/(\d+\.\d+)/);
      if (ratingMatch) {
        rating = ratingMatch[1];
      } else {
        rating = $('.rating strong').first().text().trim();
      }
    }
    if (!poster) {
      poster = $('.detail picture img').attr('src') || $('img[itemprop="image"]').attr('src');
    }
    quality = $('.info-tag span').filter((i, el) => {
      const text = $(el).text().trim();
      return ['WEBDL', '1080p', '720p', 'HD', 'Bluray'].some(q => text.includes(q));
    }).first().text().trim();
    const synopsis = $('.synopsis').attr('data-full') || $('.synopsis').text().trim();
    const details = {};
    $('.detail p').each((i, el) => {
      const label = $(el).find('span').text().replace(':', '').trim().toLowerCase();
      const value = $(el).text().replace($(el).find('span').text(), '').trim();
      if (label === 'subtitle') details.subtitle = value;
      if (label === 'sutradara') details.director = value;
      if (label === 'bintang film') details.cast = value.split(',').map(s => s.trim());
      if (label === 'negara') details.country = value;
      if (label === 'votes') details.votes = value;
      if (label === 'release') details.releaseDate = value;
      if (label === 'updated') details.updatedAt = value;
    });
    const genres = [];
    $('.tag-list a[href*="/genre/"]').each((i, el) => genres.push($(el).text().trim()));
    if (genres.length === 0) {
      $('.genre a, [itemprop="genre"] a').each((i, el) => genres.push($(el).text().trim()));
    }
    let download = $('.movie-action a[title^="Download"]').attr('href') || $('.btn-download').attr('href') || null;
    if (download && download.startsWith('//')) download = `https:${download}`;
    const streams = [];
    $('#player-list li a').each((i, el) => {
      const server = $(el).attr('data-server') || $(el).text().trim();
      let iframeUrl = $(el).attr('data-url') || $(el).attr('href');
      if (iframeUrl && iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;
      if (iframeUrl) streams.push({ server: server.toUpperCase(), url: iframeUrl });
    });
    if (streams.length === 0) {
      $('.player-list li, .player-select li').each((i, el) => {
        const server = $(el).text().trim();
        let iframeUrl = $(el).find('a').attr('href') || $(el).attr('data-iframe') || $(el).find('iframe').attr('src');
        if (iframeUrl && iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;
        if (iframeUrl) streams.push({ server, url: iframeUrl });
      });
    }
    if (streams.length === 0) {
      $('iframe').each((i, el) => {
        let src = $(el).attr('src');
        if (src && src.includes('playeriframe')) {
          if (src.startsWith('//')) src = `https:${src}`;
          streams.push({ server: `Server ${i + 1}`, url: src });
        }
      });
    }
    return {
      title,
      year,
      duration,
      poster,
      rating,
      quality,
      genres: Array.from(new Set(genres)),
      synopsis,
      ...details,
      download,
      streams
    };
  } catch (error) {
    console.error(`Error fetching detail: ${error.message}`);
    throw error;
  }
}

module.exports = {
  getHome,
  getSearch,
  getFilter,
  getDetail
};
