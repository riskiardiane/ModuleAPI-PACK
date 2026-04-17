# ModuleAPI-PACK 🚀

Koleksi API Scraper modular yang powerful untuk berbagai kebutuhan, mulai dari downloader, sticker generator, hingga konten Islami.

## ✨ Fitur Utama

| Kategori | Fitur | Deskripsi |
| :--- | :--- | :--- |
| **Downloader** | TikTok | Download video TikTok tanpa watermark via SSS-TikTok. |
| **Sticker** | Brat & BratVid | Generate stiker teks ala Brat (tulisan putih background gelap) untuk foto & video. |
| **Anime** | Animku | Scraper data anime dari Animku (Search, Detail, Watch, Genre, dll). |
| **Movie** | LK21 | Informasi film, filter kategori, hingga ekstraksi link download dari LK21. |
| **Musik** | Lyrics | Cari lirik lagu secara akurat berdasarkan judul atau artis. |
| **Islami** | Quran & Doa | Daftar surah, ayat, dan doa-doa harian dari Quran NU. |

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

Anda dapat mencoba fitur-fitur yang tersedia menggunakan `test.js`.

### Format Perintah:
```bash
node test.js <fitur> <input>
```

### Contoh Penggunaan:

#### 1. TikTok Downloader
```bash
node test.js tiktok https://vt.tiktok.com/xxxx/
```

#### 2. Brat Sticker (Tulisan)
```bash
node test.js brat "halo dunia"
```

#### 3. Quran (Daftar Surah)
```bash
node test.js quranlist
```

#### 4. LK21 (Cari Film)
```bash
node test.js lk21search "avengers"
```

## 📦 Pengembangan (Modular)

Proyek ini dibangun secara modular. Anda bisa melihat logika utama di direktori `data/` dan memanggilnya melalui `fitur.js`.

```javascript
const { tiktok, brat, animku, lk21, lyrics, quran } = require("./fitur");

// Contoh memanggil fitur Quran
async function getSurah() {
    const data = await quran.getSurah(1); // Al-Fatihah
    console.log(data);
}
```

## 📝 Kontribusi

Kontribusi selalu terbuka! Silakan fork repository ini dan kirimkan Pull Request.

## 📄 Lisensi

Proyek ini berada di bawah lisensi **ISC**.

---
Dibuat dengan ❤️ oleh [riskiardiane](https://github.com/riskiardiane)
