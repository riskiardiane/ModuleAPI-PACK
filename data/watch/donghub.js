const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://donghub.vip';

const CHROME_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Cache-Control': 'max-age=0'
};

const client = axios.create({
  baseURL: BASE_URL,
  headers: CHROME_HEADERS,
  timeout: 30000
});

function parseAnimeCards(elements, $) {
  const results = [];
  elements.each((i, el) => {
    const card = $(el);
    let title = card.find('.egghead .eggtitle').text().trim();
    if (!title) {
        title = card.find('.tt').clone().children().remove().end().text().trim();
    }
    const fullTitle = card.find('h2').text().trim() || card.find('a').attr('title');
    if (!title) title = fullTitle.split(' Episode ')[0];
    const link = card.find('a').attr('href');
    const image = card.find('img').attr('src') || card.find('img').attr('data-src');
    let type = card.find('.eggtype').text().trim() || card.find('.typez').text().trim();
    const status = card.find('.status').text().trim();
    let episode = card.find('.eggepisode').text().trim() || card.find('.epx').text().trim();
    const sub = card.find('.sb').text().trim();
    const isHot = card.find('.hotbadge').length > 0;
    const rating = card.find('.numscore').text().trim();
    if (title && link) {
      const slug = link.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '');
      results.push({
        title,
        full_title: fullTitle,
        slug,
        thumb: image,
        type: type || "ONA",
        status: status || "Ongoing",
        episode: episode,
        sub: sub || "Sub",
        is_hot: isHot,
        rating: rating || null,
        link
      });
    }
  });
  return results;
}

async function getHome() {
  try {
    const { data } = await client.get('/');
    const $ = cheerio.load(data);
    const featured = [];
    $('#slidertwo .swiper-slide.item').each((i, el) => {
      const slide = $(el);
      const title = slide.find('h2 a').text().trim();
      const link = slide.find('h2 a').attr('href');
      const bimage = slide.find('.backdrop').css('background-image');
      const image = bimage ? bimage.replace(/url\(['"]?([^'"]*)['"]?\)/, '$1') : null;
      const synopsis = slide.find('.info p').text().trim();
      if (title && link) {
        featured.push({
          title,
          slug: link.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, ''),
          link,
          image,
          synopsis
        });
      }
    });
    const popularToday = parseAnimeCards($('.popularslider .bs'), $);
    const latestRelease = parseAnimeCards($('.latesthome').closest('.bixbox').find('.bs'), $);
    const recommendations = [];
    $('.series-gen .nav-tabs li').each((i, el) => {
      const tab = $(el);
      const genreName = tab.find('a').text().trim();
      const targetId = tab.find('a').attr('href').replace('#', '');
      const pane = $(`#${targetId}`);
      if (pane.length) {
        recommendations.push({
          genre: genreName,
          results: parseAnimeCards(pane.find('.bs'), $)
        });
      }
    });
    return {
      success: true,
      data: {
        featured,
        popularToday,
        latestRelease,
        recommendations
      }
    };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function search(query, options = {}) {
  try {
    const { page = 1 } = options;
    const params = { s: query };
    if (page > 1) params.paged = page;
    const { data } = await client.get('/', { params });
    const $ = cheerio.load(data);
    const results = parseAnimeCards($('.listupd .bs'), $);
    const hasNext = $('.pagination a.next, .pagination .nav-links a[rel="next"]').length > 0;
    return {
      success: true,
      data: {
        query,
        page,
        hasNext,
        count: results.length,
        results
      }
    };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function getAnimeList(options = {}) {
  try {
    const { status = '', type = '', order = 'update', genre = [], page = 1 } = options;
    const params = new URLSearchParams();
    params.append('status', status);
    params.append('type', type);
    params.append('order', order);
    if (Array.isArray(genre)) {
      genre.forEach(g => params.append('genre[]', g));
    } else if (genre) {
      params.append('genre[]', genre);
    }
    if (page > 1) params.append('paged', page);
    const url = `/anime/?${params.toString()}`;
    const { data } = await client.get(url);
    const $ = cheerio.load(data);
    const results = parseAnimeCards($('.listupd .bs'), $);
    const hasNext = $('.pagination a.next, .pagination .nav-links a[rel="next"]').length > 0;
    return {
      success: true,
      data: {
        filters: { status, type, order, genre },
        page,
        hasNext,
        results
      }
    };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function getDetail(slug, options = {}) {
  try {
    const { limitEpisodes = null } = options;
    const url = slug.startsWith('http') ? slug : `${BASE_URL}/${slug}/`;
    const { data } = await client.get(url);
    const $ = cheerio.load(data);
    const title = $('.bigcontent .infox h1').text().trim() || $('.entry-title').text().trim();
    const thumbnail = $('.bigcontent .thumb img').attr('src');
    const coverImage = $('.bigcover .ime img').attr('src');
    const info = {};
    $('.bigcontent .spe span').each((i, el) => {
      const label = $(el).find('b').text().replace(':', '').trim().toLowerCase();
      const value = $(el).text().replace($(el).find('b').text(), '').trim();
      if (label && value) info[label] = value;
    });
    const genres = [];
    $('.genxed a').each((i, el) => {
      genres.push($(el).text().trim());
    });
    const synopsis = $('.synp .entry-content').text().trim() || $('.desc').text().trim();
    const episodes = [];
    $('.eplister ul li').each((i, el) => {
      if (limitEpisodes && i >= limitEpisodes) return false;
      const item = $(el);
      const epTitle = item.find('.epl-title').text().trim();
      const epNum = item.find('.epl-num').text().trim();
      const epLink = item.find('a').attr('href');
      const epDate = item.find('.epl-date').text().trim();
      if (epLink) {
        episodes.push({
          number: epNum,
          title: epTitle,
          slug: epLink.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, ''),
          link: epLink,
          date: epDate
        });
      }
    });
    return {
      success: true,
      data: {
        title,
        slug,
        thumbnail,
        coverImage,
        info,
        genres,
        synopsis,
        episodes
      }
    };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function getWatch(slug) {
  try {
    const url = slug.startsWith('http') ? slug : `${BASE_URL}/${slug}/`;
    const { data } = await client.get(url);
    const $ = cheerio.load(data);
    const title = $('.entry-title').text().trim() || $('h1').text().trim();
    const servers = [];
    $('.mirror option').each((i, el) => {
      const serverName = $(el).text().trim();
      const encodedIframe = $(el).attr('value');
      if (encodedIframe && serverName && serverName !== 'Select Video Server') {
        try {
          const iframeHtml = Buffer.from(encodedIframe, 'base64').toString('utf-8');
          const iframeSrc = cheerio.load(iframeHtml)('iframe').attr('src');
          servers.push({
            name: serverName,
            iframe: iframeHtml,
            src: iframeSrc
          });
        } catch (e) {
        }
      }
    });
    const defaultPlayer = $('#pembed iframe').attr('src');
    const animeLink = $('.naveps .nvsc a').attr('href');
    const prevEpisode = $('.naveps .nvs a[href*="episode"]').first().attr('href');
    const nextEpisode = $('.naveps .nvs a[href*="episode"]').last().attr('href');
    const detailBlock = $('.single-info');
    const animeDetail = {
      seriesTitle: detailBlock.find('h2[itemprop="partOfSeries"]').text().trim(),
      thumbnail: detailBlock.find('.thumb img').attr('src'),
      rating: detailBlock.find('.rating strong').text().replace('Rating', '').trim(),
      genres: [],
      info: {},
      synopsis: detailBlock.find('.desc').text().trim()
    };
    detailBlock.find('.genxed a').each((i, el) => {
      animeDetail.genres.push($(el).text().trim());
    });
    detailBlock.find('.spe span').each((i, el) => {
      const label = $(el).find('b').text().replace(':', '').trim().toLowerCase();
      const value = $(el).text().replace($(el).find('b').text(), '').trim();
      if (label && value) animeDetail.info[label] = value;
    });
    const recommendedSeries = parseAnimeCards($('.releases h3:contains("Recommended Series")').closest('.bixbox').find('.bs'), $);
    return {
      success: true,
      data: {
        title,
        slug,
        defaultPlayer,
        servers,
        animeDetail,
        recommendedSeries,
        animeSlug: animeLink ? animeLink.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '') : null,
        prevEpisode: prevEpisode || null,
        nextEpisode: nextEpisode || null
      }
    };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function getSchedule() {
  try {
    const { data } = await client.get('/schedule/');
    const $ = cheerio.load(data);
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
      const daySection = $(`.bixbox.schedulepage.sch_${day}`);
      if (daySection.length) {
        schedule[day] = parseAnimeCards(daySection.find('.bs'), $);
      }
    });
    return { success: true, data: schedule };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function getGenreList() {
  try {
    const { data } = await client.get('/anime/?status=&type=&order=update');
    const $ = cheerio.load(data);
    const genres = [];
    $('input[name="genre[]"]').each((i, el) => {
      const slug = $(el).attr('value');
      const label = $(el).attr('id');
      if (slug && label) {
        genres.push({
          name: label.replace('genre-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          slug
        });
      }
    });
    return { success: true, data: genres };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

async function getByGenre(slug, page = 1) {
  try {
    const url = page > 1 ? `/genres/${slug}/page/${page}/` : `/genres/${slug}/`;
    const { data } = await client.get(url);
    const $ = cheerio.load(data);
    const results = parseAnimeCards($('.listupd .bs'), $);
    const hasNext = $('.pagination a.next, .pagination .nav-links a[rel="next"]').length > 0;
    return {
      success: true,
      data: {
        genre: slug,
        page,
        hasNext,
        results
      }
    };
  } catch (error) {
    throw { success: false, message: error.message };
  }
}

module.exports = {
  getHome,
  search,
  getAnimeList,
  getDetail,
  getWatch,
  getSchedule,
  getGenreList,
  getByGenre
};
