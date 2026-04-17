const axios = require('axios');
const cheerio = require('cheerio');
const BASE_URL = 'https://quran.nu.or.id';
async function getListSurah() {
    try {
        const { data } = await axios.get(BASE_URL);
        const $ = cheerio.load(data);
        const surahs = [];
        $('.nui-CardSurah').each((i, el) => {
            const anchor = $(el).closest('a');
            const href = anchor.length ? anchor.attr('href') : $(el).parent('a').attr('href');
            if (href) {
                const number = $(el).find('.text-xl.font-bold').text().trim();
                const latinName = $(el).find('h2.nui-card-title').text().trim();
                const info = $(el).find('span.text-xs.text-neutral-500').text().trim();
                if (latinName && number) {
                    const [meaning, ayahCount] = info.split('·').map(s => s.trim());
                    surahs.push({
                        number,
                        name: latinName,
                        meaning: meaning || '',
                        ayahCount: ayahCount || '',
                        slug: href.replace('/', ''),
                        url: BASE_URL + href
                    });
                }
            }
        });
        return surahs;
    } catch (error) {
        throw new Error('Failed to fetch surah list: ' + error.message);
    }
}
async function getSurah(slug) {
    try {
        const url = `${BASE_URL}/${slug}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const ayahs = [];
        $('[id]').each((i, el) => {
            const id = $(el).attr('id');
            if (!isNaN(id) && id !== '') {
                const arabicSpan = $(el).find('span[dir="rtl"]');
                const arabic = arabicSpan.clone().children().remove().end().text().trim();
                const latin = $(el).find('span.text-primary-500').text().trim();
                const translation = $(el).find('span.text-neutral-700, span.text-neutral-300').text().trim();
                if (arabic) {
                    ayahs.push({
                        number: id,
                        arabic,
                        latin,
                        translation
                    });
                }
            }
        });
        const title = $('h1').text().trim() || slug;
        return {
            surah: title,
            slug,
            ayahs
        };
    } catch (error) {
        throw new Error(`Failed to fetch surah ${slug}: ` + error.message);
    }
}
async function getListDoa() {
    try {
        const { data } = await axios.get(`${BASE_URL}/doa`);
        const $ = cheerio.load(data);
        const categories = [];
        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && (href.startsWith('/doa/') || href.startsWith('doa/'))) {
                const title = $(el).find('h2').text().trim() || $(el).text().trim();
                const count = $(el).find('span.text-xs').text().trim();
                if (title && title !== 'Doa') {
                    categories.push({
                        title,
                        count,
                        slug: href.replace(/^\/?doa\//, ''),
                        url: href.startsWith('http') ? href : BASE_URL + (href.startsWith('/') ? '' : '/') + href
                    });
                }
            }
        });
        return categories;
    } catch (error) {
        throw new Error('Failed to fetch doa list: ' + error.message);
    }
}
async function getDoaDetail(slug) {
    try {
        const url = `${BASE_URL}/doa/${slug}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const doas = [];
        $('.flex.flex-col.space-y-3').each((i, el) => {
            const container = $(el).closest('.flex-grow').parent();
            const titleContainer = container.prev('.text-center');
            const title = titleContainer.find('h1').text().trim() || container.find('h2, h3').first().text().trim();
            const arabic = $(el).find('span[dir="rtl"]').text().trim();
            const latin = $(el).find('span.text-primary-500, .text-primary-300').first().text().trim();
            const translation = $(el).find('span.text-neutral-700, .text-neutral-300').last().text().trim();
            if (arabic || translation) {
                doas.push({
                    title: title || `Doa ${i + 1}`,
                    arabic,
                    latin,
                    translation
                });
            }
        });
        const categoryTitle = $('meta[property="og:title"]').attr('content')?.split('|')[0]?.trim() || slug;
        return {
            category: categoryTitle,
            slug,
            doas
        };
    } catch (error) {
        throw new Error(`Failed to fetch doa category ${slug}: ` + error.message);
    }
}
module.exports = {
    getListSurah,
    getSurah,
    getListDoa,
    getDoaDetail
};
