const { tiktok, brat, animku, lk21, donghub, lyrics, quran, komikmama } = require("./fitur");

async function testTiktok(url) {
  console.log("[Test] TikTok Downloader...");
  return await tiktok(url);
}

async function testBrat(text) {
  console.log("[Test] Brat (Plugin Mode)...");
  const mockM = { reply: (msg) => console.log("Bot Reply:", msg), chat: "test_chat" };
  const mockSock = {
    sendStimg: (chat, buffer, m, metadata) => {
      const fs = require("fs");
      fs.writeFileSync("test_brat_plugin.png", buffer);
      console.log("Sticker berhasil disimpan ke: test_brat_plugin.png");
      console.log("Metadata:", metadata);
    },
  };
  return await brat(mockM, mockSock, { text: text, prefix: ".", command: "brat" });
}

async function testBratVid(text) {
  console.log("[Test] BratVid (Plugin Mode)...");
  const mockMVid = { reply: (msg) => console.log("Bot Reply:", msg), chat: "test_chat" };
  const mockSockVid = {
    sendStimg: (chat, buffer, m, metadata) => {
      const fs = require("fs");
      fs.writeFileSync("test_brat_plugin.mp4", buffer);
      console.log("Video Sticker berhasil disimpan ke: test_brat_plugin.mp4");
      console.log("Metadata:", metadata);
    },
  };
  return await brat(mockMVid, mockSockVid, { text: text, prefix: ".", command: "bratvid" });
}

async function testAnimkuHome() {
  console.log("[Test] Animku getHome...");
  return await animku.getHome();
}

async function testAnimkuDetail(slug) {
  console.log("[Test] Animku getDetail...");
  return await animku.getDetail(slug);
}

async function testAnimkuWatch(slug) {
  console.log("[Test] Animku getWatch...");
  return await animku.getWatch(slug);
}

async function testAnimkuGenre(genre) {
  console.log("[Test] Animku getGenre...");
  return await animku.getGenre(genre);
}

async function testAnimkuSearch(query) {
  console.log("[Test] Animku search...");
  return await animku.search(query);
}

async function testAnimkuDirector(director) {
  console.log("[Test] Animku getDirector...");
  return await animku.getDirector(director);
}

async function testAnimkuProducer(producer) {
  console.log("[Test] Animku getProducer...");
  return await animku.getProducer(producer);
}

async function testAnimkuStudio(studio) {
  console.log("[Test] Animku getStudio...");
  return await animku.getStudio(studio);
}

async function testAnimkuSeason(season) {
  console.log("[Test] Animku getSeason...");
  return await animku.getSeason(season);
}

async function testAnimkuCast(cast) {
  console.log("[Test] Animku getCast...");
  return await animku.getCast(cast);
}

async function testLK21Home() {
  console.log("[Test] LK21 getHome...");
  return await lk21.getHome();
}

async function testLK21Search(query) {
  console.log("[Test] LK21 getSearch...");
  return await lk21.getSearch(query);
}

async function testLK21Filter(options) {
  console.log("[Test] LK21 getFilter...");
  return await lk21.getFilter(options);
}

async function testLK21Detail(slug) {
  console.log("[Test] LK21 getDetail...");
  return await lk21.getDetail(slug);
}

async function testLK21DownloadLinks(slug) {
  console.log("[Test] LK21 getDownloadLinks...");
  return await lk21.getDownloadLinks(slug);
}

async function testDonghubHome() {
  console.log("[Test] Donghub getHome...");
  return await donghub.getHome();
}

async function testDonghubSearch(query, page = 1) {
  console.log("[Test] Donghub search...");
  return await donghub.search(query, { page });
}

async function testDonghubDetail(slug, limitEpisodes = null) {
  console.log("[Test] Donghub getDetail...");
  return await donghub.getDetail(slug, { limitEpisodes });
}

async function testDonghubWatch(slug) {
  console.log("[Test] Donghub getWatch...");
  return await donghub.getWatch(slug);
}

async function testDonghubSchedule() {
  console.log("[Test] Donghub getSchedule...");
  return await donghub.getSchedule();
}

async function testDonghubGenres() {
  console.log("[Test] Donghub getGenreList...");
  return await donghub.getGenreList();
}

async function testDonghubGenre(genre, page = 1) {
  console.log("[Test] Donghub getByGenre...");
  return await donghub.getByGenre(genre, page);
}

async function testDonghubFilter(options) {
  console.log("[Test] Donghub getAnimeList (Filter)...");
  return await donghub.getAnimeList(options);
}

async function testLyricsSearch(query) {
  console.log("[Test] Lyrics search...");
  return await lyrics.searchLyrics(query);
}

async function testLyrics(trackId) {
  console.log("[Test] Get lyrics...");
  const lrcRes = await lyrics.getLyrics(trackId);
  if (lrcRes.error) {
    return { error: lrcRes.error };
  }
  return {
    trackName: lrcRes.trackName,
    artistName: lrcRes.artistName,
    albumName: lrcRes.albumName,
    lyrics: lrcRes.plainLyrics || lrcRes.syncedLyrics || "No lyrics available."
  };
}

async function testLyricsById(id) {
  console.log("[Test] Get lyrics by ID...");
  return await lyrics.getLyricsById(id);
}

async function testLyricsByDetails(params) {
  console.log("[Test] Get lyrics by details...");
  return await lyrics.getLyricsByDetails(params);
}

async function testQuranList() {
  console.log("[Test] Quran NU getListSurah...");
  return await quran.getListSurah();
}

async function testQuran(surahNumber) {
  console.log("[Test] Quran NU getSurah...");
  return await quran.getSurah(surahNumber);
}

async function testDoaList() {
  console.log("[Test] Quran NU getListDoa...");
  return await quran.getListDoa();
}

async function testDoa(id) {
  console.log("[Test] Quran NU getDoaDetail...");
  return await quran.getDoaDetail(id);
}

async function testKomikMamaHome() {
  console.log("[Test] KomikMama home...");
  return await komikmama.home();
}

async function testKomikMamaSearch(query, page) {
  console.log("[Test] KomikMama search...");
  return await komikmama.search(query, page);
}

async function testKomikMamaDetail(url) {
  console.log("[Test] KomikMama detail...");
  return await komikmama.detail(url);
}

async function testKomikMamaChapter(url) {
  console.log("[Test] KomikMama chapter...");
  return await komikmama.chapter(url);
}

async function testKomikMamaGenres() {
  console.log("[Test] KomikMama genres...");
  return await komikmama.genres();
}

async function testKomikMamaByGenre(slug, page) {
  console.log("[Test] KomikMama getByGenre...");
  return await komikmama.getByGenre(slug, page);
}

async function testKomikMamaFilter(genre, status, type, order, page) {
  console.log("[Test] KomikMama getFilter...");
  return await komikmama.getFilter({ genre, status, type, order, page });
}

module.exports = {
  testTiktok,
  testBrat,
  testBratVid,
  testAnimkuHome,
  testAnimkuDetail,
  testAnimkuWatch,
  testAnimkuGenre,
  testAnimkuSearch,
  testAnimkuDirector,
  testAnimkuProducer,
  testAnimkuStudio,
  testAnimkuSeason,
  testAnimkuCast,
  testLK21Home,
  testLK21Search,
  testLK21Filter,
  testLK21Detail,
  testLK21DownloadLinks,
  testDonghubHome,
  testDonghubSearch,
  testDonghubDetail,
  testDonghubWatch,
  testDonghubSchedule,
  testDonghubGenres,
  testDonghubGenre,
  testDonghubFilter,
  testLyricsSearch,
  testLyrics,
  testLyricsById,
  testLyricsByDetails,
  testQuranList,
  testQuran,
  testDoaList,
  testDoa,
  testKomikMamaHome,
  testKomikMamaSearch,
  testKomikMamaDetail,
  testKomikMamaChapter,
  testKomikMamaGenres,
  testKomikMamaByGenre,
  testKomikMamaFilter
};

if (require.main === module) {
  const args = process.argv.slice(2);
  let command = args[0];
  let p1 = args[1];
  let p2 = args[2];
  let p3 = args[3];
  let p4 = args[4];
  let p5 = args[5];

  if (!command) {
    console.log("🚀 =========================================== 🚀");
    console.log("       ModuleAPI-PACK CLI Tester v2.0         ");
    console.log("🚀 =========================================== 🚀");
    console.log("\nPenggunaan: node test.js <command> [params...]");
    
    console.log("\n📌 [DONGHUA SHORTCUTS]");
    console.log("  - node test.js donghua home [page]");
    console.log("  - node test.js donghua search \"soul land\"");
    console.log("  - node test.js donghua detail \"slug\"");
    console.log("  - node test.js donghua watch \"slug-eps\"");
    console.log("  - node test.js donghua schedule");
    console.log("  - node test.js donghua genres");

    console.log("\n📌 [KOMIK SHORTCUTS]");
    console.log("  - node test.js komikmama home");
    console.log("  - node test.js komikmama search \"query\" [page]");
    console.log("  - node test.js komikmama detail \"url\"");
    console.log("  - node test.js komikmama reading \"url\"");
    console.log("  - node test.js komikmama genres");
    console.log("  - node test.js genre \"martial-arts\" [page]");
    console.log("  - node test.js komikmama filter <genre_id> <status> <type> <order> [page]");

    console.log("\n📌 [OTHER SHORTCUTS]");
    console.log("  - node test.js tiktok <url>");
    console.log("  - node test.js brat \"text\"");
    console.log("  - node test.js bratvid \"text\"");
    console.log("  - node test.js lyrics \"query\"");
    console.log("  - node test.js quran <surah_number>");

    console.log("\n📌 [LEGACY MODE]");
    console.log("  - node test.js testDonghubSearch \"soul land\"");
    console.log("  - node test.js testAnimkuHome");
    process.exit(0);
  }

  const shortcuts = {
    donghua: {
      home: 'testDonghubHome',
      search: 'testDonghubSearch',
      detail: 'testDonghubDetail',
      watch: 'testDonghubWatch',
      schedule: 'testDonghubSchedule',
      genres: 'testDonghubGenres',
      genre: 'testDonghubGenre'
    },
    donghub: 'donghua',
    tiktok: 'testTiktok',
    lyrics: {
      search: 'testLyricsSearch',
      get: 'testLyrics',
      id: 'testLyricsById',
      detail: 'testLyricsByDetails'
    },
    quran: {
      list: 'testQuranList',
      surah: 'testQuran',
      doa: 'testDoa',
      doalist: 'testDoaList'
    },
    brat: 'testBrat',
    bratvid: 'testBratVid',
    animku: {
      home: 'testAnimkuHome',
      search: 'testAnimkuSearch',
      detail: 'testAnimkuDetail',
      watch: 'testAnimkuWatch'
    },
    lk21: {
      home: 'testLK21Home',
      search: 'testLK21Search',
      detail: 'testLK21Detail',
      download: 'testLK21DownloadLinks'
    },
    komikmama: {
      home: 'testKomikMamaHome',
      search: 'testKomikMamaSearch',
      detail: 'testKomikMamaDetail',
      chapter: 'testKomikMamaChapter',
      reading: 'testKomikMamaChapter',
      genres: 'testKomikMamaGenres',
      genre: 'testKomikMamaByGenre',
      filter: 'testKomikMamaFilter'
    },
    genre: 'testKomikMamaByGenre',
    komik: 'komikmama'
  };

  if (shortcuts[command]) {
    let target = shortcuts[command];
    if (typeof target === 'string' && shortcuts[target]) target = shortcuts[target];

    if (typeof target === 'object') {
      const sub = (p1 || 'home').toLowerCase();
      if (target[sub]) {
        command = target[sub];
        p1 = p2;
        p2 = p3;
        p3 = p4;
        p4 = p5;
        p5 = args[6];
      }
    } else {
      command = target;
    }
  }

  const fn = module.exports[command];
  if (typeof fn === 'function') {
    (async () => {
      try {
        let param1 = p1;
        if (p1 && (p1.startsWith('{') || p1.startsWith('['))) {
          try { param1 = JSON.parse(p1); } catch (e) { }
        }
        const result = await fn(param1, p2, p3, p4, p5);
        console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        console.error("❌ Execution Error:", err.message || err);
      }
    })();
  } else {
    console.log(`❌ Command '${command}' tidak ditemukan.`);
    console.log("Ketik 'node test.js' tanpa parameter untuk melihat daftar perintah.");
  }
}
