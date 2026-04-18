# Panduan Penggunaan Test Module (test.js)

File `test.js` menyediakan fungsi-fungsi test untuk menguji setiap fitur. Import module dan panggil fungsi yang diinginkan.

---

## 🚀 Cara Penggunaan

Kamu bisa menjalankan test langsung melalui terminal dengan fitur **Shortcut CLI** atau menggunakan mode manual.

### 1. Menggunakan Shortcut (Rekomendasi)

Sekarang kamu bisa menggunakan perintah yang lebih pendek:

```bash
# Donghua (Donghub)
node test.js donghua home
node test.js donghua search "perfect world"
node test.js donghua detail "perfect-world"
node test.js donghua watch "renegade-immortal-episode-135-subtitle-indonesia"
node test.js donghua schedule
node test.js donghua genres
node test.js donghua genre action 2

# Anime (Animku)
node test.js animku home
node test.js animku search "a"
node test.js animku detail "tensei-shitara-slime-datta-ken-4th-season"
node test.js animku watch "tensei-shitara-slime-datta-ken-4th-season-episode-3-subtitle-indonesia"

# Movie (LK21)
node test.js lk21 home
node test.js lk21 search "avengers"
node test.js lk21 detail "thrash-2026"

# Music (Lyrics)
node test.js lyrics search "perfect ed sheeran"
node test.js lyrics get "perfect ed sheeran"
node test.js lyrics id 3481024
node test.js lyrics detail "{\"artist_name\":\"Ariis\",\"track_name\":\"Baby Doll\"}"

# Islami (Quran & Doa)
node test.js quran surah al-fatihah
node test.js quran list
node test.js quran doa doa-haji-umrah
node test.js quran doalist

# Komik (KomikMama)
node test.js komikmama home
node test.js komikmama search "a"
node test.js komikmama detail "https://komikmama.online/komik/one-piece/"
node test.js komikmama reading "https://komikmama.online/one-piece-chapter-1174-bahasa-indonesia/"
node test.js komikmama genres
node test.js komikmama martial-arts 2
node test.js komikmama filter 11 ongoing manhwa update 1

# Meionovels (MeioNovel)
node test.js meionovels home
node test.js meionovels search "a" [page]
node test.js meionovels detail "seni-pembalasan-sang-iblis-perempuan"
node test.js meionovels chapter "https://meionovels.com/novel/anak-cahaya/chapter-357/"
node test.js meionovels genres
node test.js meionovels genre "action" [page]

# Komikindo
node test.js komikindo home
node test.js komikindo search "a"
node test.js komikindo detail "https://komikindo.ch/komik/a-princess-who-reads-fortune/"
node test.js komikindo chapter "https://komikindo.ch/a-princess-who-reads-fortune-chapter-2/"
node test.js komikindo latest [page]
node test.js komikindo colored [page]
node test.js komikindo mangalist [page]
node test.js komikindo manga [page]
node test.js komikindo manhwa [page]
node test.js komikindo manhua [page]
node test.js komikindo genre martial-arts 2

# Downloader & Sticker
node test.js tiktok <url>
node test.js spotify <url_atau_judul>
node test.js brat "halo dunia"
node test.js bratvid "video teks"
```

### 2. Menggunakan Module (Manual)

```javascript
const test = require('./test');

// Jalankan fungsi test
(async () => {
    const result = await test.testDonghubSchedule();
    console.log(result);
})();
```

---

## 📥 Downloader & Media

| Fitur | Fungsi | Parameter | Contoh |
| :--- | :--- | :--- | :--- |
| **TikTok** | `testTiktok(url)` | `url` (string) | `test.testTiktok("https://vt.tiktok.com/xxxx/")` |
| **Brat (Image)** | `testBrat(text)` | `text` (string) | `test.testBrat("halo dunia")` |
| **Brat (Video)** | `testBratVid(text)` | `text` (string) | `test.testBratVid("halo dunia")` |
| **Spotify** | `testSpotify(url)` | `url` (string) | `test.testSpotify("https://open.spotify.com/track/xxx")` |

---

## 📺 Animku (Anime Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Home** | `testAnimkuHome()` | - | Anime terbaru di halaman utama. |
| **Search** | `testAnimkuSearch(query)` | `query` (string) | Mencari anime berdasarkan judul. |
| **Detail** | `testAnimkuDetail(slug)` | `slug` (string) | Detail informasi anime. |
| **Watch** | `testAnimkuWatch(slug_eps)` | `slug_eps` (string) | Link streaming episode tertentu. |
| **Genre** | `testAnimkuGenre(genre)` | `genre` (string) | Daftar anime berdasarkan genre. |
| **Director** | `testAnimkuDirector(name)` | `name` (string) | Anime berdasarkan sutradara. |
| **Producer** | `testAnimkuProducer(name)` | `name` (string) | Anime berdasarkan produser. |
| **Studio** | `testAnimkuStudio(name)` | `name` (string) | Anime berdasarkan studio. |
| **Season** | `testAnimkuSeason(season)` | `season` (string) | Anime berdasarkan musim. |
| **Cast** | `testAnimkuCast(name)` | `name` (string) | Anime berdasarkan pengisi suara. |

---

## 🎬 LK21 (Movie Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Home** | `testLK21Home()` | - | Film terbaru di halaman utama. |
| **Search** | `testLK21Search(query)` | `query` (string) | Mencari film di LK21. |
| **Detail** | `testLK21Detail(slug)` | `slug` (string) | Detail informasi film. |
| **Filter** | `testLK21Filter(options)` | `options` (object) | Filter dengan JSON, e.g. `{genre: "action", year: "2023"}` |

---

## 🏮 Donghub (Donghua Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Home** | `testDonghubHome(page?)` | `page` (number, optional) | Anime trending di halaman utama. |
| **Schedule** | `testDonghubSchedule()` | - | Jadwal rilis harian (Senin-Minggu). |
| **Genres** | `testDonghubGenres()` | - | List 18 genre tersedia. |
| **Search** | `testDonghubSearch(query, page?)` | `query` (string), `page` (number, optional) | Mencari donghua. Default page 1. |
| **Detail** | `testDonghubDetail(slug, limit?)` | `slug` (string), `limit` (number, optional) | Detail + episodes. Default: semua episode. |
| **Watch** | `testDonghubWatch(slug_ep)` | `slug_ep` (string) | Watch links + download links. |
| **By Genre** | `testDonghubGenre(genre)` | `genre` (string) | Donghua berdasarkan genre. |

### Contoh Penggunaan Donghub

```javascript
const test = require('./test');

(async () => {
    // Jadwal rilis
    const schedule = await test.testDonghubSchedule();
    console.log(schedule.monday); // Anime rilis Senin

    // Search dengan pagination
    const search = await test.testDonghubSearch("perfect world", 1);
    console.log(search.results);

    // Detail dengan limit 10 episodes
    const detail = await test.testDonghubDetail("perfect-world", 10);
    console.log(detail.episodes); // Hanya 10 episode
    console.log(detail.totalEpisodes); // Total semua episode (63)
    console.log(detail.episodesLimited); // true

    // Watch
    const watch = await test.testDonghubWatch("perfect-world-episode-1");
    console.log(watch.streamUrl);
})();
```

---

## 🎵 Music (Lyrics Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Search** | `testLyricsSearch(query)` | `query` (string) | Mencari daftar lagu untuk mendapatkan ID. |
| **Get Lyrics** | `testLyrics(trackId)` | `trackId` (string) | Mendapatkan lirik lagu secara instan. |
| **By ID** | `testLyricsById(id)` | `id` (string) | Lirik berdasarkan ID spesifik. |
| **By Details** | `testLyricsByDetails(params)` | `params` (object) | Lirik dengan detail, e.g. `{artist_name: "Ariis", track_name: "Baby Doll"}` |

---

## 🕋 Islami (Quran & Doa)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Surah List** | `testQuranList()` | - | Daftar 114 Surah. |
| **Get Surah** | `testQuran(number)` | `number` (number) | Daftar ayat dalam satu surah. |
| **Doa List** | `testDoaList()` | - | Daftar doa-doa harian. |
| **Doa Detail** | `testDoa(id)` | `id` (number) | Teks Arab dan terjemahan doa. |

---

## 📚 KomikMama (Manga Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Home** | `testKomikMamaHome()` | - | Komik terbaru, slider, dan populer. |
| **Search** | `testKomikMamaSearch(q, p)` | `query` (str), `page` (num) | Cari komik dengan pagination. |
| **Detail** | `testKomikMamaDetail(url)` | `url` (string) | Informasi lengkap komik & list chapter. |
| **Reading** | `testKomikMamaChapter(url)` | `url` (string) | Gambar chapter dan navigasi prev/next. |
| **Genres** | `testKomikMamaGenres()` | - | Daftar semua kategori genre & jumlah komik. |
| **By Genre** | `testKomikMamaByGenre(slug, p)` | `slug` (str), `page` (num) | Daftar komik per genre (E.g. martial-arts). |
| **Filter** | `testKomikMamaFilter(g, s, t, o, p)` | ID/string (multiple) | Filter canggih (Genre ID, Status, Tipe, Order). |

## 🇮🇩 Komikindo (Manga Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Home** | `testKomikindoHome()` | - | Komik terbaru, popular, slider. |
| **Search** | `testKomikindoSearch(q, p)` | `query` (str), `page` (num) | Cari komik dengan pagination. |
| **Detail** | `testKomikindoDetail(url)` | `url` (string) | Informasi lengkap komik & list chapter. |
| **Reading** | `testKomikindoChapter(url)` | `url` (string) | Gambar chapter dan navigasi prev/next. |
| **Latest** | `testKomikindoLatest(p)` | `page` (num) | Daftar komik update terbaru. |
| **Colored** | `testKomikindoColored(p)` | `page` (num) | Daftar komik berwarna (Webtoon). |
| **Manga List**| `testKomikindoMangaList(p)` | `page` (num) | Daftar semua komik. |
| **Manga** | `testKomikindoManga(p)` | `page` (num) | Daftar manga (Jepang). |
| **Manhwa** | `testKomikindoManhwa(p)` | `page` (num) | Daftar manhwa (Korea). |
| **Manhua** | `testKomikindoManhua(p)` | `page` (num) | Daftar manhua (China). |
| **By Genre** | `testKomikindoByGenre(slug, p)` | `slug` (str), `page` (num) | Daftar komik per genre (E.g. action). |

---

# Meionovels (Light Novel Scraper)

| Fitur | Fungsi | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Home** | `testMeionovelsHome()` | - | Novel terbaru, slider, dan populer. |
| **Search** | `testMeionovelsSearch(q, p)` | `query` (str), `page` (num) | Cari novel dengan pagination. |
| **Detail** | `testMeionovelsDetail(url)` | `url` (string) | Info novel & list chapter (AJAX supported). |
| **Reading** | `testMeionovelsChapter(url)` | `url` (string) | Isi teks novel dan navigasi prev/next. |
| **Genres** | `testMeionovelsGenres()` | - | Daftar kategori genre yang tersedia. |
| **By Genre** | `testMeionovelsByGenre(slug, p)` | `slug` (str), `page` (num) | Daftar novel per genre (E.g. action). |

---

## 💡 Tips

1. **Semua fungsi mengembalikan Promise** - selalu gunakan `await` atau `.then()`
2. **Parameter opsional** - ditandai dengan tanda tanya `?`, bisa diabaikan
3. **Pagination** - gunakan parameter `page` untuk navigasi halaman
4. **Limit Episodes** - gunakan parameter `limit` untuk membatasi jumlah episode

---

> [!NOTE]
> File `test.js` sekarang berbentuk module exports. Setiap fitur memiliki fungsi test terpisah dengan prefix `test`, contoh: `testDonghubSchedule`, `testAnimkuDetail`, dll.
