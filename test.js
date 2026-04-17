// test.js
const { tiktok, brat, animku, lk21, lyrics, quran } = require("./fitur");

const args = process.argv.slice(2);
const command = args[0];
const input = args.slice(1).join(" ");

async function run() {
  if (!command) {
    console.log("Penggunaan: node test.js <fitur> <input>");
    console.log("Fitur: tiktok, brat, bratvid, animku, lk21, lyrics, quran");
    return;
  }

  // Some commands don't require additional input
  const noInputCommands = ["animkuhome", "lk21home", "quranlist", "doalist"];
  if (!input && !noInputCommands.includes(command.toLowerCase())) {
    console.log(`Silakan masukkan input untuk fitur ${command}`);
    return;
  }

  try {
    switch (command.toLowerCase()) {
      // -----------------------------------------------------------------
      // TikTok
      case "tiktok":
        console.log("[Test] TikTok Downloader...");
        const resTikTok = await tiktok(input);
        console.log(JSON.stringify(resTikTok, null, 2));
        break;

      // -----------------------------------------------------------------
      // Brat (image)
      case "brat":
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
        await brat(mockM, mockSock, { text: input, prefix: ".", command: "brat" });
        break;

      // -----------------------------------------------------------------
      // BratVid (video)
      case "bratvid":
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
        await brat(mockMVid, mockSockVid, { text: input, prefix: ".", command: "bratvid" });
        break;

      // -----------------------------------------------------------------
      // Animku API
      case "animkuhome":
        console.log("[Test] Animku getHome...");
        console.log(JSON.stringify(await animku.getHome(), null, 2));
        break;
      case "animkudetail":
        console.log("[Test] Animku getDetail...");
        console.log(JSON.stringify(await animku.getDetail(input), null, 2));
        break;
      case "animkuwatch":
        console.log("[Test] Animku getWatch...");
        console.log(JSON.stringify(await animku.getWatch(input), null, 2));
        break;
      case "animkugenre":
        console.log("[Test] Animku getGenre...");
        console.log(JSON.stringify(await animku.getGenre(input), null, 2));
        break;
      case "animkusearch":
        console.log("[Test] Animku search...");
        console.log(JSON.stringify(await animku.search(input), null, 2));
        break;
      case "animkudirector":
        console.log("[Test] Animku getDirector...");
        console.log(JSON.stringify(await animku.getDirector(input), null, 2));
        break;
      case "animkuproducer":
        console.log("[Test] Animku getProducer...");
        console.log(JSON.stringify(await animku.getProducer(input), null, 2));
        break;
      case "animkustudio":
        console.log("[Test] Animku getStudio...");
        console.log(JSON.stringify(await animku.getStudio(input), null, 2));
        break;
      case "animkuseason":
        console.log("[Test] Animku getSeason...");
        console.log(JSON.stringify(await animku.getSeason(input), null, 2));
        break;
      case "animkucast":
        console.log("[Test] Animku getCast...");
        console.log(JSON.stringify(await animku.getCast(input), null, 2));
        break;

      // -----------------------------------------------------------------
      // LK21 API
      case "lk21home":
        console.log("[Test] LK21 getHome...");
        console.log(JSON.stringify(await lk21.getHome(), null, 2));
        break;
      case "lk21search":
        console.log("[Test] LK21 getSearch...");
        console.log(JSON.stringify(await lk21.getSearch(input), null, 2));
        break;
      case "lk21filter":
        console.log("[Test] LK21 getFilter (JSON options)...");
        let raw = input.trim().replace(/^['"]|['"]$/g, "");
        console.log('Raw input before JSON.parse:', raw);
        const filterOpts = JSON.parse(raw);
        console.log(JSON.stringify(await lk21.getFilter(filterOpts), null, 2));
        break;
      case "lk21detail":
        console.log("[Test] LK21 getDetail...");
        console.log(JSON.stringify(await lk21.getDetail(input), null, 2));
        break;
      case "lk21downloadlinks":
        console.log("[Test] LK21 getDownloadLinks...");
        console.log(JSON.stringify(await lk21.getDownloadLinks(input), null, 2));
        break;

      // -----------------------------------------------------------------
      case "lyricssearch":
        console.log("[Test] Lyrics search...");
        console.log(JSON.stringify(await lyrics.searchLyrics(input), null, 2));
        break;
      case "lyrics":
        console.log("[Test] Get lyrics...");
        const lrcRes = await lyrics.getLyrics(input);
        if (lrcRes.error) {
          console.log(lrcRes.error);
        } else {
          console.log(`Title: ${lrcRes.trackName}`);
          console.log(`Artist: ${lrcRes.artistName}`);
          if (lrcRes.albumName) console.log(`Album: ${lrcRes.albumName}`);
          console.log("----------------------------");
          console.log(lrcRes.plainLyrics || lrcRes.syncedLyrics || "No lyrics available.");
        }
        break;
      case "lyricsbyid":
        console.log("[Test] Get lyrics by ID...");
        const idRes = await lyrics.getLyricsById(input);
        console.log(JSON.stringify(idRes, null, 2));
        break;
      case "lyricsbydetails":
        console.log("[Test] Get lyrics by details (JSON input)...");
        // Expecting JSON like: {"artist_name":"Ariis","track_name":"Baby Doll"}
        let dRaw = input.trim().replace(/^['"]|['"]$/g, "").replace(/'/g, '"');
        console.log("Raw Details Input:", dRaw);
        const dParams = JSON.parse(dRaw);
        const dRes = await lyrics.getLyricsByDetails(dParams);
        console.log(JSON.stringify(dRes, null, 2));
        break;
      case "quranlist":
        console.log("[Test] Quran NU getListSurah...");
        console.log(JSON.stringify(await quran.getListSurah(), null, 2));
        break;
      case "quran":
        console.log("[Test] Quran NU getSurah...");
        console.log(JSON.stringify(await quran.getSurah(input), null, 2));
        break;
      case "doalist":
        console.log("[Test] Quran NU getListDoa...");
        console.log(JSON.stringify(await quran.getListDoa(), null, 2));
        break;
      case "doa":
        console.log("[Test] Quran NU getDoaDetail...");
        console.log(JSON.stringify(await quran.getDoaDetail(input), null, 2));
        break;
      default:
        console.log("Fitur tidak dikenal:", command);
        break;
    }
  } catch (e) {
    console.error(`Gagal menjalankan fitur ${command}:`, e.message || e);
  }
}

run();
