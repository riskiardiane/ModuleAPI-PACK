# ModuleAPI-PACK 🚀

Koleksi API Scraper modular yang powerful untuk berbagai kebutuhan, mulai dari downloader, sticker generator, hingga konten Islami.

## ✨ Fitur Utama

| Kategori | Fitur | Deskripsi |
| :--- | :--- | :--- |
| **Downloader** | TikTok | Download video TikTok tanpa watermark via SSS-TikTok. |
| **Sticker** | Brat & BratVid | Generate stiker teks ala Brat (tulisan putih background gelap) untuk foto & video. |
| **Anime** | Animku | Scraper data anime dari Animku (Search, Detail, Watch, Genre, dll). |
| **Donghua** | Donghub | Scraper donghua (anime China) dari Donghub.vip. |
| **Movie** | LK21 | Informasi film, filter kategori, hingga ekstraksi link download dari LK21. |
| **Musik** | Lyrics | Cari lirik lagu secara akurat berdasarkan judul atau artis. |
| **Islami** | Quran & Doa | Daftar surah, ayat, dan doa-doa harian dari Quran NU. |
| **Komik** | KomikMama | Scraper komik (Manga, Manhwa, Manhua) dari KomikMama.online. |

## 🛠️ Instalasi

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/).

1. Clone repository:
   ```bash
   git clone https://github.com/riskiardiane/ModuleAPI-PACK.git
   cd ModuleAPI-PACK
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

## 🚀 Cara Penggunaan

### 1. Import sebagai Module (Rekomendasi)

```javascript
const { tiktok, brat, animku, donghub, lk21, lyrics, quran } = require("./fitur");

// Contoh: Donghub - Jadwal rilis
async function getSchedule() {
    const schedule = await donghub.getSchedule();
    console.log(schedule);
}

// Contoh: Quran - Surah Al-Fatihah
async function getSurah() {
    const data = await quran.getSurah(1);
    console.log(data);
}
```

### 2. Test Module (test.js)

File `test.js` menyediakan fungsi test untuk setiap fitur:

```javascript
const test = require('./test');

// Donghub
const schedule = await test.testDonghubSchedule();
const search = await test.testDonghubSearch("perfect world", 1);
const detail = await test.testDonghubDetail("perfect-world", 10); // limit 10 episodes
const watch = await test.testDonghubWatch("perfect-world-episode-1");
const genres = await test.testDonghubGenres();

// Lainnya
const tiktokResult = await test.testTiktok("https://vt.tiktok.com/xxxx/");
const anime = await test.testAnimkuDetail("naruto");
```

## 📦 API Reference

### Donghub (Donghua Scraper)

| Method | Parameter | Return |
|--------|-----------|--------|
| `getHome(page?)` | `page` (optional) | List anime trending |
| `getSchedule()` | - | Jadwal rilis harian |
| `getGenreList()` | - | List 18 genre |
| `search(query, {page?})` | query string, page optional | Search results |
| `getDetail(slug, {limitEpisodes?})` | slug, limit optional | Detail + episodes |
| `getWatch(slug_ep)` | slug episode | Watch + download links |
| `getByGenre(genre, {page?})` | genre slug, page optional | Anime by genre |

### Animku (Anime Scraper)

| Method | Parameter | Return |
|--------|-----------|--------|
| `getHome()` | - | Anime terbaru |
| `search(query)` | query string | Search results |
| `getDetail(slug)` | anime slug | Detail info |
| `getWatch(slug_eps)` | episode slug | Streaming links |
| `getGenre(genre)` | genre name | Anime by genre |
| `getDirector(name)` | director name | Anime by director |
| `getProducer(name)` | producer name | Anime by producer |
| `getStudio(name)` | studio name | Anime by studio |
| `getSeason(season)` | season name | Anime by season |
| `getCast(name)` | cast name | Anime by cast |

### LK21 (Movie Scraper)

| Method | Parameter | Return |
|--------|-----------|--------|
| `getHome()` | - | Film terbaru |
| `getSearch(query)` | query string | Search results |
| `getDetail(slug)` | movie slug | Detail info |
| `getDownloadLinks(slug)` | movie slug | Download links |
| `getFilter({genre, year, type})` | filter object | Filtered results |

### Lyrics (Music Scraper)

| Method | Parameter | Return |
|--------|-----------|--------|
| `searchLyrics(query)` | query string | Search results |
| `getLyrics(trackId)` | track ID | Lyrics |
| `getLyricsById(id)` | lyric ID | Lyrics by ID |
| `getLyricsByDetails({artist_name, track_name})` | details object | Lyrics |

### Quran (Islamic Content)

| Method | Parameter | Return |
|--------|-----------|--------|
| `getListSurah()` | - | List 114 surah |
| `getSurah(number)` | surah number | Surah details + ayat |
| `getListDoa()` | - | List doa harian |
| `getDoaDetail(id)` | doa number | Doa detail |

### KomikMama (Manga Scraper)

| Method | Parameter | Return |
|--------|-----------|--------|
| `home()` | - | Home data (Slider, Popular, Latest) |
| `search(query, page?)` | query string, page optional | Search results with pagination |
| `detail(url)` | comic URL | Detail info + chapter list |
| `chapter(url)` | chapter URL | Chapter images + navigation |
| `genres()` | - | All genre categories |
| `getByGenre(slug, page?)` | genre slug, page optional | Comics by genre |
| `getFilter({genre, status, type, order, page})` | filter object | Advanced filter results |

## 📝 Kontribusi

Kontribusi selalu terbuka! Silakan fork repository ini dan kirimkan Pull Request.

## 📄 Lisensi

Proyek ini berada di bawah lisensi **ISC**.

---
Dibuat dengan ❤️ oleh [riskiardiane](https://github.com/riskiardiane)
