const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
async function tiktokdl2(url) {
    try {
        const headers = {
            "User-Agent": userAgent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        };
        const getRes = await axios.get("https://ssstik.io/id", { headers, timeout: 10000 });
        const $get = cheerio.load(getRes.data);
        const postEndpoint = $get("form").attr("hx-post") || "/abc?url=dl";
        let tt = "";
        const match = getRes.data.match(/tt:\s*'([^']+)'/) || 
                    getRes.data.match(/tt\s*=\s*'([^']+)'/) || 
                    getRes.data.match(/value="([^"]+)"\s*id="tt"/) || 
                    getRes.data.match(/data-tt="([^"]+)"/);
        if (match) tt = match[1];
        const dataRaw = qs.stringify({
            id: url,
            locale: "id",
            tt: tt
        });
        const postUrl = "https://ssstik.io" + postEndpoint;
        const postHeaders = {
            ...headers,
            "HX-Request": "true",
            "HX-Target": "target",
            "HX-Current-URL": "https://ssstik.io/id",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://ssstik.io/id"
        };
        const postRes = await axios.post(postUrl, dataRaw, { headers: postHeaders, timeout: 15000 });
        const $ = cheerio.load(postRes.data);
        const desc = $("p.maintext").text().trim() || "TikTok Download";
        const author = $("h2").text().trim() || "Unknown";
        const video = $("a.without_watermark").first().attr("href") || $("a.download_link").first().attr("href");
        const audio = $("a.music").first().attr("href");
        const images = [];
        const isSlide = $("ul.splide__list").length > 0;
        if (isSlide) {
            $("ul.splide__list li").each((i, el) => {
                let imgUrl = $(el).find("a").attr("href");
                if (imgUrl) images.push(imgUrl);
            });
        }
        return {
            status: true,
            author,
            description: desc,
            video,
            audio,
            images,
            isSlide
        };
    } catch (e) {
        return {
            status: true,
            message: e.message
        };
    }
}
module.exports = { tiktokdl2 };
