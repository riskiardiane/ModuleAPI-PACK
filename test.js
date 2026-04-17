// test.js - Test module for all API features
const { tiktok, brat, animku, lk21, donghub, lyrics, quran } = require("./fitur");

// -----------------------------------------------------------------
// TikTok
async function testTiktok(url) {
  console.log("[Test] TikTok Downloader...");
  return await tiktok(url);
}

// -----------------------------------------------------------------
// Brat (image)
async function testBrat(text) {
  console.log("[Test] Brat (Plugin Mode)...");
  console.log("Catatan: Fitur Brat sekarang menggunakan struktur plugin WhatsApp.");
  console.log("Mencoba menjalankan handler with mock data...");

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

// -----------------------------------------------------------------
// BratVid (video)
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

// -----------------------------------------------------------------
// Animku API
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

// -----------------------------------------------------------------
// LK21 API
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

// -----------------------------------------------------------------
// Donghub API
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

async function testDonghubGenre(genre) {
  console.log("[Test] Donghub getByGenre...");
  return await donghub.getByGenre(genre);
}

// -----------------------------------------------------------------
// Lyrics API
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

// -----------------------------------------------------------------
// Quran API
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

// -----------------------------------------------------------------
// Export all test functions
module.exports = {
  // TikTok
  testTiktok,
  
  // Brat
  testBrat,
  testBratVid,
  
  // Animku
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
  
  // LK21
  testLK21Home,
  testLK21Search,
  testLK21Filter,
  testLK21Detail,
  testLK21DownloadLinks,
  
  // Donghub
  testDonghubHome,
  testDonghubSearch,
  testDonghubDetail,
  testDonghubWatch,
  testDonghubSchedule,
  testDonghubGenres,
  testDonghubGenre,
  
  // Lyrics
  testLyricsSearch,
  testLyrics,
  testLyricsById,
  testLyricsByDetails,
  
  // Quran
  testQuranList,
  testQuran,
  testDoaList,
  testDoa
};
