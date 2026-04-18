const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://komikindo.ch';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    'Referer': BASE_URL + '/',
    'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Upgrade-Insecure-Requests': '1',
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

function getImg(el, $) {
    return $(el).attr('data-src') ||
        $(el).attr('data-lazy-src') ||
        $(el).attr('src');
}

async function home() {
    try {
        const { data } = await axios.get(BASE_URL, { headers: HEADERS });
        const $ = cheerio.load(data);

        const slider = [];
        $('#slidtop .bigslider .owl-item:not(.cloned)').each((i, el) => {
            const tooltip = $(el).find('.stooltip');
            const title = tooltip.find('.title h4 a').text().trim();
            const url = tooltip.find('.title h4 a').attr('href');
            const thumb = getImg($(el).find('.odadingmang img'), $);
            const synopsis = tooltip.find('.ttls').text().trim();
            const genres = tooltip.find('.info span:contains("Genres")').text().replace('Genres', '').trim();
            const score = tooltip.find('.metadata .skor').text().trim();
            const type = tooltip.find('.metadata span').last().text().trim();

            if (url && !slider.find(s => s.url === url)) {
                slider.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    synopsis,
                    genres,
                    score,
                    type
                });
            }
        });

        const popular = [];
        $('section.whites').each((i, section) => {
            const h2 = $(section).find('h2').text();
            if (h2.includes('Terpopuler')) {
                $(section).find('.animepost').each((j, el) => {
                    const title = $(el).find('.tt h3 a').text().trim();
                    const url = $(el).find('.animposx > a').attr('href') || $(el).find('.tt h3 a').attr('href');
                    const thumb = getImg($(el).find('.limit img'), $);
                    const chapter = $(el).find('.lsch a').text().trim();
                    const date = $(el).find('.datech').text().trim();

                    if (url) {
                        popular.push({
                            title,
                            url,
                            slug: extractSlug(url),
                            thumb,
                            chapter,
                            date
                        });
                    }
                });
            }
        });

        const latest = [];
        $('section.whites').each((i, section) => {
            const h2 = $(section).find('h2').text();
            if (h2.includes('Terbaru')) {
                $(section).find('.animepost').each((j, el) => {
                    const topLink = $(el).find('.animepostxx-top a');
                    const title = $(el).find('.tt h3').text().trim();
                    const url = topLink.attr('href');
                    const thumb = getImg($(el).find('.limietles img'), $);
                    const score = $(el).find('.info-skroep .flex-skroep:has(.fa-star)').text().trim();
                    const type = $(el).find('.info-skroep .flex-skroep:has(.typeflag)').text().trim();

                    const chapters = [];
                    $(el).find('.list-ch-skroep .lsch a').each((idx, ch) => {
                        chapters.push({
                            name: $(ch).text().trim(),
                            url: $(ch).attr('href'),
                            slug: extractSlug($(ch).attr('href'))
                        });
                    });

                    if (url) {
                        latest.push({
                            title,
                            url,
                            slug: extractSlug(url),
                            thumb,
                            score,
                            type,
                            chapters
                        });
                    }
                });
            }
        });

        return {
            status: true,
            data: {
                slider,
                popular,
                latest
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function latest(page = 1) {
    return scrapeListPage(`${BASE_URL}/komik-terbaru/page/${page}/`, page);
}

async function colored(page = 1) {
    return scrapeListPage(`${BASE_URL}/komik-berwarna/page/${page}/`, page);
}

async function mangaList(page = 1) {
    return scrapeListPage(`${BASE_URL}/daftar-manga/page/${page}/`, page);
}

async function manga(page = 1) {
    return scrapeListPage(`${BASE_URL}/manga/page/${page}/`, page);
}

async function manhwa(page = 1) {
    return scrapeListPage(`${BASE_URL}/manhwa/page/${page}/`, page);
}

async function manhua(page = 1) {
    return scrapeListPage(`${BASE_URL}/manhua/page/${page}/`, page);
}

async function scrapeListPage(url, page) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.film-list .animepost, .listupd .animepost').each((i, el) => {
            const title = $(el).find('.tt h3 a').text().trim();
            const url = $(el).find('.tt h3 a').attr('href') || $(el).find('a').first().attr('href');
            const thumb = getImg($(el).find('.limit img'), $);
            const chapter = $(el).find('.lsch a').text().trim();
            const date = $(el).find('.datech').text().trim();
            const score = $(el).find('.rating i').text().trim();
            const type = $(el).find('.typeflag').attr('class')?.replace('typeflag', '').trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    type,
                    chapter: chapter || undefined,
                    date: date || undefined,
                    score: score || undefined
                });
            }
        });

        // Pagination
        const pagination = {
            current: parseInt($('.pagination .current').text()) || page,
            total: 1,
            hasNext: $('.pagination .next').length > 0
        };

        const pages = [];
        $('.pagination .page-numbers').each((i, el) => {
            const val = parseInt($(el).text());
            if (!isNaN(val)) pages.push(val);
        });
        if (pages.length > 0) pagination.total = Math.max(...pages);

        return {
            status: true,
            data: results,
            pagination
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function search(query, page = 1) {
    try {
        const url = `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);
        const results = [];

        $('.film-list .animepost, .listupd .animepost').each((i, el) => {
            const title = $(el).find('.tt h3 a').text().trim();
            const url = $(el).find('.tt h3 a').attr('href') || $(el).find('a').first().attr('href');
            const thumb = getImg($(el).find('.limit img'), $);
            const score = $(el).find('.rating i').text().trim();
            const type = $(el).find('.typeflag').attr('class')?.replace('typeflag', '').trim();

            if (url) {
                results.push({
                    title,
                    url,
                    slug: extractSlug(url),
                    thumb,
                    score,
                    type
                });
            }
        });

        // Pagination
        const pagination = {
            current: parseInt($('.pagination .current').text()) || page,
            total: 1,
            hasNext: $('.pagination .next').length > 0
        };

        const pages = [];
        $('.pagination .page-numbers').each((i, el) => {
            const val = parseInt($(el).text());
            if (!isNaN(val)) pages.push(val);
        });
        if (pages.length > 0) pagination.total = Math.max(...pages);

        return {
            status: true,
            data: results,
            pagination
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function detail(url) {
    try {
        const { data } = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(data);

        const title = $('h1.entry-title').text().trim();
        const thumb = getImg($('.thumb img'), $);
        const description = $('.entry-content p').text().trim();

        const info = {};
        $('.spe span').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes(':')) {
                const [key, ...val] = text.split(':');
                info[key.trim().toLowerCase().replace(/\s+/g, '_')] = val.join(':').trim();
            }
        });

        const genres = [];
        $('.genre-info a, .spe span:contains("Genre") a').each((i, el) => {
            genres.push({
                name: $(el).text().trim(),
                url: $(el).attr('href'),
                slug: extractSlug($(el).attr('href'))
            });
        });

        const chapters = [];
        const chapterItems = $('#chapterlist ul li, #chapter_list li');

        if (chapterItems.length > 0) {
            chapterItems.each((i, el) => {
                const a = $(el).find('a').first();
                const url = a.attr('href');
                const date = $(el).find('.dt').text().trim();

                let name = $(el).find('.lchx, .chapternum').text().trim();
                if (!name) {
                    const tempA = a.clone();
                    tempA.find('.dt').remove();
                    name = tempA.text().trim();
                }

                if (url) {
                    chapters.push({
                        name,
                        url,
                        slug: extractSlug(url),
                        date
                    });
                }
            });
        } else {
            // Fallback for other structures
            $('#chapter_list a, #chapterlist a').each((i, el) => {
                if ($(el).closest('.dt').length > 0) return;
                const url = $(el).attr('href');
                const name = $(el).text().trim();
                if (url) {
                    chapters.push({
                        name,
                        url,
                        slug: extractSlug(url),
                        date: ""
                    });
                }
            });
        }

        return {
            status: true,
            data: {
                title,
                thumb,
                description,
                info,
                genres,
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

        // Extract manga_id and nonce from script tags
        let mangaId = '';
        let nonce = '';

        $('script').each((i, el) => {
            const s = $(el).html();
            if (!s) return;

            // Extract manga_id
            if (s.includes('manga_id')) {
                const matchId = s.match(/manga_id\s*=\s*(\d+)/) || s.match(/manga_id\s*:\s*(\d+)/);
                if (matchId && matchId[1]) mangaId = matchId[1];
            }

            // Extract nonce from kiFunction or elsewhere
            if (s.includes('ki_dynamic_view')) {
                const matchNonce = s.match(/"ki_dynamic_view"\s*:\s*"(.*?)"/) ||
                    s.match(/ki_dynamic_view\s*:\s*'(.*?)'/);
                if (matchNonce && matchNonce[1]) nonce = matchNonce[1];
            }
        });

        // If mangaId is still empty, look for it in data-id or other attributes
        if (!mangaId) {
            mangaId = $('.bookmark').attr('data-id') || $('[data-id]').attr('data-id');
        }

        let images = [];

        // Method 1: AJAX Call using nonce (most reliable for Komikindo)
        if (mangaId && nonce) {
            try {
                const params = new URLSearchParams();
                params.append('action', 'ki_dynamic_view');
                params.append('post_id', mangaId);
                params.append('_ajax_nonce', nonce);

                const { data: ajaxData } = await axios.post(`${BASE_URL}/wp-admin/admin-ajax.php`, params, {
                    headers: {
                        ...HEADERS,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': url
                    }
                });

                if (ajaxData && ajaxData.images) {
                    images = ajaxData.images;
                }
            } catch (e) { }
        }

        // Method 2: Check for ts_reader JSON (classic method)
        if (images.length === 0) {
            $('script').each((i, el) => {
                const s = $(el).html();
                if (!s) return;
                if (s.includes('ts_reader.run')) {
                    const match = s.match(/ts_reader\.run\((.*?)\);/);
                    if (match && match[1]) {
                        try {
                            const jsonData = JSON.parse(match[1]);
                            if (jsonData.sources && jsonData.sources[0] && jsonData.sources[0].images) {
                                images = jsonData.sources[0].images;
                            }
                        } catch (e) { }
                    }
                }
            });
        }

        // Method 3: Fallback to reading <img> tags
        if (images.length === 0) {
            $('#chimg-auh img, #readerarea img').each((i, el) => {
                const src = getImg(el, $);
                if (src && !src.includes('data:image') && !src.includes('ads')) {
                    images.push(src);
                }
            });
        }

        return {
            status: true,
            data: {
                title: $('.breadcrumb li:last-child').text().trim() || $('title').text().split('-')[0].trim(),
                images,
                prev: $('.nextprev a[rel="prev"]').attr('href') || null,
                next: $('.nextprev a[rel="next"]').attr('href') || null
            }
        };
    } catch (error) {
        return { status: false, message: error.message };
    }
}

async function getByGenre(slug, page = 1) {
    const url = page === 1 || page === '1' 
        ? `${BASE_URL}/tema/${slug}/` 
        : `${BASE_URL}/tema/${slug}/page/${page}/`;
    return scrapeListPage(url, page);
}

module.exports = {
    home,
    detail,
    chapter,
    latest,
    colored,
    mangaList,
    manga,
    manhwa,
    manhua,
    search,
    getByGenre
};
