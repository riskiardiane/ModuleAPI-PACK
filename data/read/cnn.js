const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.cnnindonesia.com';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Referer': BASE_URL + '/',
    'Upgrade-Insecure-Requests': '1',
    'Connection': 'keep-alive'
};

async function home() {
    try {
        const { data } = await axios.get(BASE_URL, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = {};

        // 1. Headline HL (Berita Utama Paling Atas)
        const headlineEl = $('a[dtr-sec="artikel hl"]').first();
        if (headlineEl.length) {
            results.headline = {
                title: headlineEl.find('span.text-2xl.font-medium').text().trim(),
                url: headlineEl.attr('href'),
                category: headlineEl.find('span.label').text().trim(),
                description: headlineEl.find('span.text-sm.mt-2.block').text().trim(),
                thumb: headlineEl.find('img').attr('src'),
                related: []
            };

            // Berita terkait di bawah headline
            headlineEl.parent().find('section.flex-grow a').each((i, el) => {
                results.headline.related.push({
                    title: $(el).find('h2').text().trim(),
                    url: $(el).attr('href'),
                    thumb: $(el).find('img').attr('src')
                });
            });
        }

        // 2. Terpopuler
        results.popular = [];
        $('div.overflow-y-auto article.pl-9').each((i, el) => {
            results.popular.push({
                rank: $(el).find('span.text-lg').text().trim(),
                title: $(el).find('h2').text().trim(),
                url: $(el).find('a').attr('href'),
                category: $(el).find('span.text-cnn_red').text().trim()
            });
        });

        // 3. Berita Utama (Limit 3)
        results.main_news = [];
        $('div.mb-8').find('div.grid.grid-cols-3 article.flex-grow').each((i, el) => {
            const title = $(el).find('h2').text().trim();
            const url = $(el).find('a').attr('href');
            if (title && url) {
                results.main_news.push({
                    title,
                    url,
                    category: $(el).find('span.text-cnn_red').text().trim()
                });
            }
        });
        results.main_news = results.main_news.slice(0, 3);

        // 4. Utama & Terbaru
        results.latest = [];
        results.videos = [];
        
        $('div.nhl-list article.flex-grow').each((i, el) => {
            const a = $(el).find('a').first();
            const title = a.find('h2').text().trim();
            if (title) {
                const is_video = a.find('img[alt="icon-video"]').length > 0 || a.find('span:contains("VIDEO")').length > 0 || a.attr('href').includes('/tv/');
                const is_photo = a.find('img[alt="icon-camera"]').length > 0;
                
                const item = {
                    title,
                    url: a.attr('href'),
                    category: a.find('span.text-cnn_red').text().trim(),
                    thumb: a.find('img').attr('src'),
                    is_video,
                    is_photo
                };

                if (is_video) {
                    results.videos.push(item);
                } else {
                    results.latest.push(item);
                }
            }
        });

        return {
            status: true,
            data: results
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function read(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const title = $('h1').first().text().trim();
        const author = $('.text-cnn_black_light3 span.text-cnn_red').first().text().trim() || $('.detail__author-name').text().trim();
        const date = $('.text-cnn_grey.text-sm.mb-4').first().text().trim() || $('.detail__date').text().trim();
        const thumb = $('.detail-image img').attr('src') || $('.detail__media img').attr('src') || $('.detail__media-image img').attr('src');
        
        // Images extraction (from body and gallery)
        const images = [];
        $('article img').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && !images.includes(src) && 
                !src.includes('logo.png') && 
                !src.includes('icon-') && 
                !src.includes('chevron') &&
                !src.includes('google_ads') &&
                src.includes('akcdn.detik.net.id')) { // CNN images usually from akcdn.detik.net.id
                images.push(src);
            }
        });

        // Content cleaning
        const contentEl = $('.detail-text, .detail__body-text');
        
        // Remove ads, scripts, and unwanted elements from content
        contentEl.find('script, style, .inbetween_ads, .paradetail, .para_caption, .topiksisip, .galery-foto, #idvideocnn').remove();
        
        const content = contentEl.text().trim()
            .replace(/\n\s*\n/g, '\n\n') // Clean extra newlines
            .replace(/ADVERTISEMENT/g, '')
            .replace(/SCROLL TO CONTINUE WITH CONTENT/g, '');

        return {
            status: true,
            data: {
                title,
                author,
                date,
                thumb,
                images,
                content
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function search(query, page = 1) {
    try {
        const url = `${BASE_URL}/api/search?query=${encodeURIComponent(query)}&page=${page}`;
        const { data: response } = await axios.get(url, { headers: HEADERS });
        
        if (!response || !response.data) {
            return { status: false, message: 'No data found' };
        }

        const articles = response.data.map(item => {
            let thumb = '';
            if (item.image && item.image.length > 0) {
                const img = item.image[0];
                thumb = `https://akcdn.detik.net.id/visual/${img.strnmfile}_169${img.extension}?w=500&q=90`;
            }

            const typeMap = {
                1: 'article',
                2: 'photo',
                3: 'video'
            };

            return {
                title: item.strjudul,
                url: item.url,
                thumb: thumb,
                type: typeMap[item.intidjnkanal] || 'article',
                category: item.strnmkanal,
                time: item.dtnewsdate,
                summary: item.strringkasan
            };
        });

        const totalItems = response.total || 0;
        const totalPages = Math.ceil(totalItems / 10);

        return {
            status: true,
            data: {
                query,
                articles,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: totalPages,
                    total_items: totalItems
                }
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function video(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        const title = $('h1').text().trim() || $('.detail__title').text().trim();
        const description = $('.detail-text').text().trim() || $('.detail__body-text').text().trim();
        
        // Find video URL (m3u8) in scripts
        let video_url = '';
        const m3u8Match = data.match(/https?:\/\/[^"']+\.m3u8/);
        if (m3u8Match) {
            video_url = m3u8Match[0].replace(/\\\//g, '/');
        }

        return {
            status: true,
            data: {
                title,
                description,
                video_url
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

module.exports = {
    home,
    read,
    search,
    video
};
