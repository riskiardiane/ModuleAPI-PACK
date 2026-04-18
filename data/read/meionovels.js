const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://meionovels.com';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Referer': BASE_URL,
    'Connection': 'keep-alive'
};

function extractSlug(url) {
    if (!url) return null;
    try {
        const parts = url.replace(/\/$/, '').split('/');
        return parts[parts.length - 1];
    } catch (e) {
        return null;
    }
}

function getImg(el, $) {
    const src = $(el).attr('data-src') || 
                $(el).attr('data-lazy-src') || 
                $(el).attr('srcset')?.split(',')[0].split(' ')[0] ||
                $(el).attr('src');
    return src;
}

async function home() {
    try {
        const { data } = await axios.get(BASE_URL, { headers: HEADERS });
        const $ = cheerio.load(data);
        
        const slider = [];
        $('.popular-slider .slider__item').each((i, el) => {
            const title = $(el).find('.post-title a').text().trim();
            const url = $(el).find('.post-title a').attr('href');
            const thumb = getImg($(el).find('.slider__thumb img'), $);
            const chapters = [];
            $(el).find('.chapter-item .chapter a').each((j, chap) => {
                chapters.push({
                    name: $(chap).text().trim(),
                    url: $(chap).attr('href'),
                    slug: extractSlug($(chap).attr('href'))
                });
            });

            if (url) {
                slider.push({ 
                    title, 
                    url, 
                    slug: extractSlug(url),
                    thumb,
                    chapters
                });
            }
        });

        const latest = [];
        $('#loop-content .page-listing-item .page-item-detail').each((i, el) => {
            const title = $(el).find('.post-title h3 a').text().trim();
            const url = $(el).find('.post-title h3 a').attr('href');
            const thumb = getImg($(el).find('.item-thumb img'), $);
            const chapters = [];
            
            $(el).find('.list-chapter .chapter-item').each((j, chapEl) => {
                const chapA = $(chapEl).find('.chapter a');
                const time = $(chapEl).find('.post-on').text().trim();
                if (chapA.length > 0) {
                    chapters.push({
                        name: chapA.text().trim(),
                        url: chapA.attr('href'),
                        slug: extractSlug(chapA.attr('href')),
                        time
                    });
                }
            });

            if (url) {
                latest.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    chapters
                });
            }
        });

        const popularSidebar = [];
        $('.widget-manga-recent .popular-item-wrap').each((i, el) => {
            const title = $(el).find('.widget-title a').text().trim();
            const url = $(el).find('.widget-title a').attr('href');
            const thumb = getImg($(el).find('.popular-img img'), $);
            const chapters = [];
            
            $(el).find('.list-chapter .chapter-item').each((j, chapEl) => {
                const chapA = $(chapEl).find('.chapter a');
                if (chapA.length > 0) {
                    chapters.push({
                        name: chapA.text().trim(),
                        url: chapA.attr('href'),
                        slug: extractSlug(chapA.attr('href'))
                    });
                }
            });

            if (url) {
                popularSidebar.push({ title, url, slug: extractSlug(url), thumb, chapters });
            }
        });

        return {
            status: true,
            data: {
                slider,
                latest,
                popularSidebar
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function detail(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const title = $('.post-title h1').text().trim();
        const thumb = getImg($('.summary_image img'), $);
        const rating = $('#averagerate').text().trim() || $('.post-total-rating .score').text().trim();
        const totalVotes = $('#countrate').text().trim() || $('.post-total-rating .total_votes').text().trim();
        const synopsis = $('#editdescription').text().trim() || $('.description-summary .summary__content').text().trim();
        
        const info = {};
        $('.post-content .post-content_item').each((i, el) => {
            const key = $(el).find('.summary-heading h5').text().trim().replace(/\(s\)/g, '').toLowerCase().replace(/\s+/g, '_');
            let val;
            
            const links = $(el).find('.summary-content a');
            if (links.length > 0) {
                val = links.map((j, link) => $(link).text().trim()).get();
                if (val.length === 1 && !['genre', 'tag'].includes(key)) val = val[0];
            } else {
                val = $(el).find('.summary-content').text().trim();
            }
            
            if (key && key !== 'rating') {
                info[key] = val;
            }
        });

        let chapters = [];
        const chapterListItems = $('.wp-manga-chapter');
        
        if (chapterListItems.length > 0) {
            chapterListItems.each((i, el) => {
                const a = $(el).find('a');
                const name = a.text().replace(/\s+/g, ' ').trim();
                const url = a.attr('href');
                const date = $(el).find('.chapter-release-date').text().trim();
                if (url) chapters.push({ name, url, slug: extractSlug(url), date });
            });
        }

        // If chapters are still empty or we want to ensure we get ALL chapters (Madara direct AJAX)
        if (chapters.length === 0) {
            try {
                const ajaxUrl = url.replace(/\/$/, '') + '/ajax/chapters/';
                const { data: ajaxData } = await axios.post(ajaxUrl, {}, { 
                    headers: HEADERS
                });
                
                if (ajaxData && ajaxData !== '0') {
                    const $ajax = cheerio.load(ajaxData);
                    $ajax('.wp-manga-chapter').each((i, el) => {
                        const a = $ajax(el).find('a');
                        const name = a.text().replace(/\s+/g, ' ').trim();
                        const url = a.attr('href');
                        const date = $ajax(el).find('.chapter-release-date').text().trim();
                        if (url) chapters.push({ name, url, slug: extractSlug(url), date });
                    });
                }
            } catch (e) {
                // console.error('AJAX Error:', e.message);
            }
        }

        return {
            status: true,
            data: {
                title,
                url,
                slug: extractSlug(url),
                thumb,
                rating,
                totalVotes,
                synopsis,
                info,
                chapters
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function chapter(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        // For Novel, content is usually in .reading-content
        const content = $('.reading-content').html();

        return {
            status: true,
            data: {
                title: $('.breadcrumb li.active').text().trim() || $('title').text().split('-')[0].trim(),
                url,
                slug: extractSlug(url),
                content: content,
                prev: $('.nav-previous a').attr('href') || null,
                next: $('.nav-next a').attr('href') || null
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function search(query, page = 1) {
    try {
        const url = `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}&post_type=wp-manga`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.c-tabs-item__content').each((i, el) => {
            const title = $(el).find('.post-title h3 a').text().trim();
            const url = $(el).find('.post-title h3 a').attr('href');
            const thumb = getImg($(el).find('.tab-thumb img'), $);
            const latestChapter = $(el).find('.latest-chap .chapter a').text().trim();

            if (url) {
                results.push({ 
                    title, 
                    url, 
                    slug: extractSlug(url),
                    thumb, 
                    latestChapter 
                });
            }
        });

        return { status: true, data: results };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function genres() {
    try {
        const { data } = await axios.get(BASE_URL + '/novel/', { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.genres__collapse .list-unstyled li a, .genres_wrap .list-unstyled li a').each((i, el) => {
            const name = $(el).clone().children().remove().end().text().trim();
            const url = $(el).attr('href');
            const count = $(el).find('.count').text().trim().replace(/[()]/g, '');

            if (url) {
                results.push({
                    name,
                    slug: extractSlug(url),
                    url,
                    count
                });
            }
        });

        return { status: true, data: results };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByGenre(slug, page = 1) {
    try {
        const url = `${BASE_URL}/novel-genre/${slug}/page/${page}/`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('#loop-content .page-listing-item .page-item-detail').each((i, el) => {
            const title = $(el).find('.post-title h3 a').text().trim();
            const url = $(el).find('.post-title h3 a').attr('href');
            const thumb = getImg($(el).find('.item-thumb img'), $);
            const chapters = [];
            
            $(el).find('.list-chapter .chapter-item').each((j, chapEl) => {
                const chapA = $(chapEl).find('.chapter a');
                const time = $(chapEl).find('.post-on').text().trim();
                if (chapA.length > 0) {
                    chapters.push({
                        name: chapA.text().trim(),
                        url: chapA.attr('href'),
                        slug: extractSlug(chapA.attr('href')),
                        time
                    });
                }
            });

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    chapters
                });
            }
        });

        return { status: true, data: results };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

module.exports = {
    home,
    detail,
    chapter,
    search,
    genres,
    getByGenre
};
