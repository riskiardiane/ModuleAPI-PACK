const { tiktokdl2 } = require("./data/downloader/ssstiktok");
const brat = require("./data/fitur/brat");
const animku = require("./data/watch/animku");
const lk21 = require("./data/watch/lk21");
const donghub = require("./data/watch/donghub");
const lyrics = require("./data/music/lyrics");
const quran = require("./data/islami/quran");
const komikmama = require("./data/read/komikmama");
const meionovels = require("./data/read/meionovels");
const spotify = require("./data/downloader/spotify");
const komikindo = require("./data/read/komikindo");
const removebg = require("./images/removebg");

module.exports = {
  tiktok: tiktokdl2,
  brat,
  animku,
  lk21,
  donghub,
  lyrics,
  quran,
  komikmama,
  meionovels,
  spotify,
  komikindo,
  removebg
};
