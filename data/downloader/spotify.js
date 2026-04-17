const axios = require("axios");
const WebSocket = require("ws");
 
const headers = {
  "User-Agent": "Mozilla/5.0",
  "Origin": "https://spomp3.com",
  "Referer": "https://spomp3.com/"
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
    data.forEach(v => getArtists(v).forEach(push));
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
  const { data: process } = await axios.post(
    "https://spomp3.com/process_input",
    { url: input },
    { headers }
  );
 
  let title = "Spotify Audio";
  let artist = "Unknown Artist";
  let thumb = "";
  let target = input;
 
  if (process.type === "metadata") {
    const track = process.tracks?.[0] || {};
    title = process.item_name || track.name || title;
    thumb = normalizeImg(track.cover || process.cover_image);
    artist = getArtists(track.artists || track.artist).join(", ") || artist;
 
  } else if (process.type === "search") {
    const track = process.tracks?.[0];
    if (!track) throw "Lagu tidak ditemukan";
 
    title = track.name || title;
    thumb = normalizeImg(track.cover);
    artist = getArtists(track.artists || track.artist).join(", ") || artist;
 
    target = `https://open.spotify.com/track/${track.spotify_id}`;
  } else {
    throw "Metadata tidak ditemukan";
  }
 
  const { data: dl } = await axios.post(
    "https://spomp3.com/download/spotify",
    { url: target },
    { headers }
  );
 
  if (!dl.task_id) throw "Task ID tidak ditemukan";
 
  const audioUrl = await new Promise((resolve, reject) => {
    const ws = new WebSocket(`wss://spomp3.com/ws/status/${dl.task_id}`);
 
    ws.on("message", (msg) => {
      const res = JSON.parse(msg);
 
      if (res.state === "SUCCESS") {
        ws.close();
        const file = res.songs?.[0]?.download_path;
        if (!file) return reject("Download gagal");
        resolve(`https://spomp3.com/files/${file}`);
      }
 
      if (res.state === "FAILURE") {
        ws.close();
        reject(res.exc || "Server error");
      }
    });
 
    ws.on("error", reject);
  });
 
  return {
    title,
    artist,
    thumb,
    url: audioUrl
  };
}
 
module.exports = spotifyDl;