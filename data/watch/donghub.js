const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://donghub.vip';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive'
  },
  timeout: 60000
});

function parseAnimeCards(elements, $) {
  const results = [];
  elements.each((i, el) => {
    const title = $(el).find('.tt').text().trim() || $(el).find('h2').text().trim();
    const link = $(el).find('a').attr('href');
    const image = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
    const type = $(el).find('.typez').text().trim();
    const status = $(el).find('.status').text().trim();
    const episode = $(el).find('.epx').text().trim();
    const subtitle = $(el).find('.sb').text().trim();
    
    if (title && link) {
      const slug = link.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '');
      results.push({
        title,
        slug,
        link,
        image,
        type: type || null,
        status: status || null,
        episode: episode || null,
        subtitle: subtitle || null
      });
    }
  });
  return results;
}

function parseSliderItems(elements, $) {
  const results = [];
  elements.each((i, el) => {
    const title = $(el).find('h2 a').text().trim();
    const link = $(el).find('h2 a').attr('href');
    const image = $(el).find('.backdrop').css('background-image');
    const imageUrl = image ? image.replace(/url\(['"]?([^'"]*)['"]?\)/, '$1') : null;
    const synopsis = $(el).find('.info p').text().trim();
    const jtitle = $(el).find('h2 a').attr('data-jtitle');
    
    if (title && link) {
      const slug = link.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '');
      results.push({
        title,
        jtitle: jtitle || null,
        slug,
        link,
        image: imageUrl,
        synopsis: synopsis || null
      });
    }
  });
  return results;
}

async function getHome() {
  try {
    const { data } = await client.get('/');
    const $ = cheerio.load(data);
    
    const sliderItems = parseSliderItems($('#slidertwo .swiper-slide.item'), $);
    const popularToday = parseAnimeCards($('.popularslider .bs'), $);
    const latestRelease = parseAnimeCards($('.latesthome').closest('.bixbox').find('.bs'), $);
    
    return {
      featured: sliderItems,
      popularToday,
      latestRelease
    };
  } catch (error) {
    console.error(`Error fetching home: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
  }
}

async function search(query, page = 1) {
  try {
    const params = { s: query };
    if (page > 1) params.paged = page;
    
    const { data } = await client.get('/', { params });
    const $ = cheerio.load(data);
    
    const results = parseAnimeCards($('.listupd .bs'), $);
    const hasNext = $('.pagination a.next, .pagination .nav-links a[rel="next"]').length > 0;
    
    return {
      query,
      page,
      hasNext,
      count: results.length,
      results
    };
  } catch (error) {
    console.error(`Error searching: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
  }
}

async function getDetail(slug, options = {}) {
  try {
    const { limitEpisodes = null } = options; // null = all, number = limit
    
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
      if (label && value) {
        info[label] = value;
      }
    });
    
    const genres = [];
    $('.genxed a').each((i, el) => {
      genres.push($(el).text().trim());
    });
    
    const synopsis = $('.synp .entry-content').text().trim() || $('.desc').text().trim();
    
    const episodes = [];
    $('.eplister ul li').each((i, el) => {
      if (limitEpisodes && i >= limitEpisodes) return false; // Break if limit reached
      
      const epTitle = $(el).find('.epl-title').text().trim();
      const epNum = $(el).find('.epl-num').text().trim();
      const epLink = $(el).find('a').attr('href');
      const epDate = $(el).find('.epl-date').text().trim();
      const epSub = $(el).find('.epl-sub .status').text().trim();
      
      if (epLink) {
        const epSlug = epLink.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '');
        episodes.push({
          number: epNum,
          title: epTitle,
          slug: epSlug,
          link: epLink,
          date: epDate,
          subtitle: epSub
        });
      }
    });
    
    const firstEpisode = $('.epcurfirst').text().trim();
    const lastEpisode = $('.epcurlast').text().trim();
    const totalEpisodes = $('.eplister ul li').length; // Get total even if limited
    
    return {
      title,
      slug,
      thumbnail,
      coverImage,
      info,
      genres,
      synopsis,
      episodeCount: episodes.length,
      totalEpisodes,
      firstEpisode,
      lastEpisode,
      episodesLimited: limitEpisodes ? true : false,
      episodes
    };
  } catch (error) {
    console.error(`Error fetching detail: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
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
      const dataIndex = $(el).attr('data-index');
      
      if (encodedIframe && serverName && serverName !== 'Select Video Server') {
        try {
          const iframe = Buffer.from(encodedIframe, 'base64').toString('utf-8');
          const iframeSrc = cheerio.load(iframe)('iframe').attr('src');
          
          servers.push({
            name: serverName,
            index: dataIndex,
            iframe,
            src: iframeSrc
          });
        } catch (e) {
          servers.push({
            name: serverName,
            index: dataIndex,
            iframe: null,
            src: null,
            error: 'Failed to decode iframe'
          });
        }
      }
    });
    
    const defaultPlayer = $('#pembed iframe').attr('src');
    
    const animeLink = $('.naveps .nvsc a').attr('href');
    const prevEpisode = $('.naveps .nvs a[href*="episode"]').first().attr('href');
    const nextEpisode = $('.naveps .nvs a[href*="episode"]').last().attr('href');
    
    let animeSlug = null;
    if (animeLink) {
      animeSlug = animeLink.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '');
    }
    
    return {
      title,
      slug,
      defaultPlayer,
      servers,
      animeSlug,
      prevEpisode: prevEpisode || null,
      nextEpisode: nextEpisode || null
    };
  } catch (error) {
    console.error(`Error fetching watch: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
  }
}

async function getSchedule() {
  try {
    const { data } = await client.get('/schedule/');
    const $ = cheerio.load(data);
    
    const schedule = {};
    const dayClasses = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    dayClasses.forEach(day => {
      const daySection = $(`.bixbox.schedulepage.sch_${day}`);
      if (daySection.length) {
        const animeList = [];
        
        daySection.find('.bs').each((j, animeEl) => {
          const title = $(animeEl).find('.tt').text().trim() || $(animeEl).find('a').attr('title');
          const link = $(animeEl).find('a').attr('href');
          const image = $(animeEl).find('img').attr('src') || $(animeEl).find('img').attr('data-src');
          const episode = $(animeEl).find('.epx').text().trim();
          const time = $(animeEl).find('.epx').attr('data-rlsdt'); // Release timestamp
          
          if (title && link) {
            const slug = link.replace(BASE_URL, '').replace(/^\//, '').replace(/\/$/, '');
            animeList.push({
              title,
              slug,
              link,
              image,
              episode,
              releaseTime: time || null
            });
          }
        });
        
        if (animeList.length > 0) {
          schedule[day] = animeList;
        }
      }
    });
    
    return schedule;
  } catch (error) {
    console.error(`Error fetching schedule: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
  }
}

async function getGenreList() {
  try {
    // Scrape from anime page filter section
    const { data } = await client.get('/anime/?status=&type=&order=update');
    const $ = cheerio.load(data);
    
    const genres = [];
    $('input[name="genre[]"]').each((i, el) => {
      const slug = $(el).attr('value');
      const label = $(el).attr('id');
      if (slug && label) {
        const name = label.replace('genre-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        genres.push({
          name,
          slug,
          link: `${BASE_URL}/genres/${slug}/`
        });
      }
    });
    
    // Also get from anime detail pages if available
    if (genres.length === 0) {
      $('.genxed a').each((i, el) => {
        const name = $(el).text().trim();
        const link = $(el).attr('href');
        if (name && link) {
          const slug = link.replace(BASE_URL, '').replace('/genres/', '').replace(/^\//, '').replace(/\/$/, '');
          if (!genres.find(g => g.slug === slug)) {
            genres.push({ name, slug, link });
          }
        }
      });
    }
    
    return [...new Map(genres.map(g => [g.slug, g])).values()];
  } catch (error) {
    console.error(`Error fetching genres: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
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
      genre: slug,
      page,
      hasNext,
      results
    };
  } catch (error) {
    console.error(`Error fetching genre: ${error.message}`);
    throw {
      success: false,
      message: error.message,
      status: error.response?.status
    };
  }
}

module.exports = {
  getHome,
  search,
  getDetail,
  getWatch,
  getSchedule,
  getGenreList,
  getByGenre
};
