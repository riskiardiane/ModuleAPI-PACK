const axios = require("axios");
const WebSocket = require("ws");
 
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Origin": "https://spomp3.com",
  "Referer": "https://spomp3.com/",
  "Content-Type": "application/json"
};
 
const isValid = (v) => {
  if (!v) return false;
  const t = String(v).trim().toLowerCase();
  return !["unknown", "loading...", "-", "_", "none", "n/a"].includes(t);
};
 
const getArtists = (data) => {
  let arr = [];
 
  const push = (v) => {
    if (isValid(v) && !arr.includes(v)) arr.push(v);
  };
 
  if (!data) return arr;
 
  if (typeof data === "string") {
    data.split(",").forEach(push);
  } else if (Array.isArray(data)) {
    data.forEach(v => {
      if (typeof v === "string") push(v);
      else if (v && v.name) push(v.name);
    });
  } else if (typeof data === "object") {
    ["name", "artist", "artists", "artist_name"].forEach(k => {
      if (data[k]) getArtists(data[k]).forEach(push);
    });
  }
 
  return arr;
};
 
const normalizeImg = (url) => {
  if (!url) return "";
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("http")) return url;
  return "";
};
 
async function spotifyDl(input) {
  // Step 1: Process Input/Search
  const { data: process } = await axios.post(
    "https://spomp3.com/process_input",
    { url: input },
    { headers }
  );

  let trackData;
  if (process.type === "metadata" || process.type === "search") {
    trackData = process.tracks?.[0];
    if (!trackData) throw "Lagu tidak ditemukan. Coba gunakan judul lagu jika link tidak berhasil.";
  } else {
    throw "Server sedang sibuk atau format tidak didukung (spomp3 limit reached?)";
  }

  // Step 2: Extract metadata for response
  const title = trackData.name || "Unknown Track";
  const artistsList = getArtists(trackData.artists || trackData.artist);
  const artistStr = artistsList.join(", ") || "Unknown Artist";
  const thumb = normalizeImg(trackData.cover || trackData.image);

  // Step 3: Initiate Download
  // Crucial: spomp3 expects the EXACT same track object from process_input
  const { data: dl } = await axios.post(
    "https://spomp3.com/download/search-track",
    trackData,
    { headers }
  );

  if (!dl.task_id) throw "Gagal membuat antrean download. Coba lagi dalam beberapa saat.";

  // Step 4: Monitor via WebSocket
  const audioUrl = await new Promise((resolve, reject) => {
    const wsUrl = `wss://spomp3.com/ws/status/${dl.task_id}`;
    const ws = new WebSocket(wsUrl, {
        headers: {
            "User-Agent": headers["User-Agent"],
            "Origin": headers["Origin"]
        }
    });
    
    // Timeout 2 menit karena download lagu bisa lama
    const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) ws.close();
        reject("Download timeout (Antrean terlalu lama)");
    }, 120000);

    ws.on("message", (msg) => {
      try {
        const res = JSON.parse(msg);

        if (res.state === "SUCCESS") {
          clearTimeout(timeout);
          ws.close();
          const file = res.songs?.[0]?.download_path;
          if (!file) return reject("Download berhasil tapi file path kosong.");
          resolve(`https://spomp3.com/files/${file}`);
        }

        if (res.state === "FAILURE") {
          clearTimeout(timeout);
          ws.close();
          reject(res.exc || "Server gagal memproses lagu.");
        }
      } catch (e) {
        // Ignore parsing errors from non-json messages if any
      }
    });

    ws.on("error", (err) => {
        clearTimeout(timeout);
        reject("Server WebSocket error.");
    });

    ws.on("close", () => {
        clearTimeout(timeout);
        // If closed without success/failure message
    });
  });

  return {
    title,
    artist: artistStr,
    thumb,
    url: audioUrl
  };
}
 
module.exports = spotifyDl;