const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://otakupoi.org';
const NEONIME_URL = `${BASE_URL}/neonime/`;

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Referer': BASE_URL + '/',
    'Connection': 'keep-alive'
};

function extractSlug(url) {
    if (!url) return null;
    try {
        return url.replace(/\/$/, '').split('/').pop();
    } catch (e) {
        return null;
    }
}

async function home() {
    try {
        const { data } = await axios.get(NEONIME_URL, { headers: HEADERS });
        const $ = cheerio.load(data);
        const ongoing = [];
        const completed = [];

        let currentSection = ongoing;

        // Parent selector based on user sample
        $('.main-col > div').each((i, el) => {
            const element = $(el);

            // Identify section switch based on panel text
            if (element.hasClass('panel')) {
                const text = element.text().toLowerCase();
                if (text.includes('ongoing')) {
                    currentSection = ongoing;
                } else if (text.includes('completed')) {
                    currentSection = completed;
                }
                return;
            }

            // Scrape items
            if (element.hasClass('xrelated')) {
                const a = element.find('a');
                const url = a.attr('href');
                const thumb = a.find('img').attr('src');
                const title = a.find('.titlelist').text().trim();
                const episode = a.find('.eplist').text().trim();
                const rating = a.find('.starlist').text().trim();

                if (url) {
                    currentSection.push({
                        title,
                        url,
                        slug: extractSlug(url),
                        thumb,
                        episode,
                        rating
                    });
                }
            }
        });

        return {
            status: true,
            data: {
                ongoing,
                completed
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function search(query, page = 1) {
    try {
        const url = `${BASE_URL}/neonime/search/?q=${encodeURIComponent(query)}&page=${page}`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function detail(slug) {
    try {
        const url = slug.startsWith('http') ? slug : `${BASE_URL}/neonime/${slug}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const title = $('h1.xptitle').text().trim();
        const thumb = $('.concover img').attr('src');
        const synopsis = $('div[itemprop="description"]').text().trim();
        
        const info = {};
        $('.tabcontent#info .tablist').each((i, el) => {
            const label = $(el).find('b').text().trim();
            const key = label.toLowerCase().replace(/\s+/g, '_');
            const links = $(el).find('span a');
            
            if (links.length > 0) {
                const results = [];
                links.each((j, link) => {
                    const name = $(link).text().trim();
                    const relUrl = $(link).attr('href');
                    if (relUrl) {
                        const fullUrl = relUrl.startsWith('http') ? relUrl : `${BASE_URL}${relUrl.startsWith('/') ? '' : '/'}${relUrl}`;
                        results.push({
                            name,
                            url: fullUrl,
                            slug: extractSlug(fullUrl)
                        });
                    }
                });
                info[key] = results;
            } else {
                info[key] = $(el).find('span').text().trim();
            }
        });

        // Genres is usually also in info, but we keep it separate if needed or redundant.
        // Let's ensure it's captured correctly.
        const genres = info.genre || [];

        const episodes = [];
        $('.bottom-line a.othereps').each((i, el) => {
            const epsUrl = $(el).attr('href');
            const epsTitle = $(el).text().trim();
            if (epsUrl) {
                const fullUrl = epsUrl.startsWith('http') ? epsUrl : `${BASE_URL}${epsUrl}`;
                episodes.push({
                    title: epsTitle,
                    url: fullUrl,
                    slug: extractSlug(fullUrl)
                });
            }
        });

        return {
            status: true,
            data: {
                title,
                thumb,
                synopsis,
                info,
                genres,
                episodes
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function watch(slug) {
    try {
        const url = slug.startsWith('http') ? slug : `${BASE_URL}/watch/${slug}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const title = $('h1.title-post').text().trim();
        const date = $('.post-body span.date').text().trim();
        
        const video = [];
        // Extract from iframe
        $('iframe#istream, iframe').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && !src.includes('ads')) {
                video.push({
                    server: `Default Server ${i + 1}`,
                    url: src.startsWith('//') ? `https:${src}` : src
                });
            }
        });

        const server_list = [];
        $('.playerlist li#jplayers li').each((i, el) => {
            server_list.push({
                id: $(el).attr('id'),
                name: $(el).text().trim()
            });
        });

        const download_links = [];
        let currentFormat = "Unknown";
        $('#contdl').contents().each((i, node) => {
            const el = $(node);
            if (node.type === 'tag' && node.name === 'li') {
                const text = el.text().trim();
                if (text && !el.find('a').length) {
                    currentFormat = text;
                }
            } else if (node.type === 'tag' && node.name === 'ul') {
                el.find('li').each((j, li) => {
                    const quality = $(li).find('strong').text().replace(/&nbsp;/g, '').trim();
                    const links = [];
                    $(li).find('a').each((k, a) => {
                        const href = $(a).attr('href');
                        links.push({
                            name: $(a).text().trim(),
                            url: href ? (href.startsWith('http') ? href : `${BASE_URL}${href}`) : null
                        });
                    });
                    if (quality) {
                        download_links.push({
                            format: currentFormat,
                            quality,
                            links
                        });
                    }
                });
            }
        });

        const episode_list = [];
        $('.bottom-line a.othereps').each((i, el) => {
            const epsUrl = $(el).attr('href');
            const epsTitle = $(el).text().trim();
            if (epsUrl) {
                const fullUrl = epsUrl.startsWith('http') ? epsUrl : `${BASE_URL}${epsUrl}`;
                episode_list.push({
                    title: epsTitle,
                    url: fullUrl,
                    slug: extractSlug(fullUrl)
                });
            }
        });

        return {
            status: true,
            data: {
                title,
                date,
                video,
                server_list,
                download_links,
                episode_list
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function ongoing(page = 1) {
    try {
        const url = page == 1 ? `${BASE_URL}/neonime/ongoing/` : `${BASE_URL}/neonime/ongoing/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByGenre(slug, page = 1) {
    try {
        const url = page == 1 ? `${BASE_URL}/neonime/genres/${slug}/` : `${BASE_URL}/neonime/genres/${slug}/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByCast(slug, page = 1) {
    try {
        const url = page == 1 ? `${BASE_URL}/neonime/casts/${slug}/` : `${BASE_URL}/neonime/casts/${slug}/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByNetwork(slug, page = 1) {
    try {
        const url = page == 1 ? `${BASE_URL}/neonime/networks/${slug}/` : `${BASE_URL}/neonime/networks/${slug}/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByStudio(slug, page = 1) {
    try {
        const url = page == 1 ? `${BASE_URL}/neonime/studios/${slug}/` : `${BASE_URL}/neonime/studios/${slug}/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByYear(year, page = 1) {
    try {
        const url = page == 1 ? `${BASE_URL}/neonime/years/${year}/` : `${BASE_URL}/neonime/years/${year}/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.xrelated').each((i, el) => {
            const a = $(el).find('a');
            const url = a.attr('href');
            const thumb = a.find('img').attr('src');
            const title = a.find('.titlelist').text().trim();
            const episode = a.find('.eplist').text().trim();
            const rating = a.find('.starlist').text().trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    episode,
                    rating
                });
            }
        });

        const totalPagesText = $('.line-card p').text();
        const totalPages = parseInt(totalPagesText.match(/of (\d+) Pages/)?.[1]) || 1;

        return {
            status: true,
            data: results,
            pagination: {
                current: parseInt(page),
                total: totalPages,
                hasNext: $('.pagination a').text().includes('»')
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

module.exports = {
    home,
    search,
    ongoing,
    getByGenre,
    getByCast,
    getByNetwork,
    getByStudio,
    getByYear,
    detail,
    watch
};
