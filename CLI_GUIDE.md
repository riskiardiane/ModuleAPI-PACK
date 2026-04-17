# Panduan Lengkap Perintah CLI (test.js)

Gunakan file `test.js` untuk menguji setiap fitur secara langsung melalui terminal. Format dasar perintah adalah:
`node test.js <fitur> <input>`

---

## 📥 Downloader & Media

| Fitur | Perintah | Deskripsi |
| :--- | :--- | :--- |
| **TikTok** | `node test.js tiktok <url>` | Download video TikTok tanpa watermark. |
| **Brat (Image)** | `node test.js brat "<teks>"` | Generate stiker teks ala Brat (output: `test_brat_plugin.png`). |
| **Brat (Video)** | `node test.js bratvid "<teks>"` | Generate video stiker ala Brat (output: `test_brat_plugin.mp4`). |

---

## 📺 Animku (Anime Scraper)

| Fitur | Perintah | Deskripsi |
| :--- | :--- | :--- |
| **Home** | `node test.js animkuhome` | Menampilkan anime terbaru di halaman utama. |
| **Search** | `node test.js animkusearch "<judul>"` | Mencari anime berdasarkan judul. |
| **Detail** | `node test.js animkudetail <slug>` | Mendapatkan detail informasi anime. |
| **Watch** | `node test.js animkuwatch <slug_eps>` | Mendapatkan link streaming episode tertentu. |
| **Genre** | `node test.js animkugenre <genre>` | Menampilkan daftar anime berdasarkan genre. |
| **Director** | `node test.js animkudirector <nama>` | Menampilkan anime berdasarkan sutradara. |
| **Producer** | `node test.js animkuproducer <nama>` | Menampilkan anime berdasarkan produser. |
| **Studio** | `node test.js animkustudio <nama>` | Menampilkan anime berdasarkan studio. |
| **Season** | `node test.js animkuseason <season>` | Menampilkan anime berdasarkan musim (mis: winter-2024). |
| **Cast** | `node test.js animkucast <nama>` | Menampilkan anime berdasarkan pengisi suara. |

---

## 🎬 LK21 (Movie Scraper)

| Fitur | Perintah | Deskripsi |
| :--- | :--- | :--- |
| **Home** | `node test.js lk21home` | Menampilkan film terbaru di halaman utama. |
| **Search** | `node test.js lk21search "<judul>"` | Mencari film di LK21. |
| **Detail** | `node test.js lk21detail <slug>` | Mendapatkan detail informasi film. |
| **Download** | `node test.js lk21downloadlinks <slug>` | Mendapatkan link download film. |
| **Filter** | `node test.js lk21filter '{"genre":"action","year":"2023"}'` | Mencari film dengan filter spesifik (format JSON). |

---

## 🎵 Music (Lyrics Scraper)

| Fitur | Perintah | Deskripsi |
| :--- | :--- | :--- |
| **Search** | `node test.js lyricssearch "<judul>"` | Mencari daftar lagu untuk mendapatkan ID. |
| **Get Lyrics** | `node test.js lyrics "<judul/artis>"` | Mendapatkan lirik lagu secara instan. |
| **By ID** | `node test.js lyricsbyid <id>` | Mendapatkan lirik berdasarkan ID spesifik. |
| **By Details** | `node test.js lyricsbydetails '{"artist_name":"Ariis","track_name":"Baby Doll"}'` | Mendapatkan lirik dengan input JSON detail. |

---

## 🕋 Islami (Quran & Doa)

| Fitur | Perintah | Deskripsi |
| :--- | :--- | :--- |
| **Surah List** | `node test.js quranlist` | Menampilkan daftar 114 Surah. |
| **Get Surah** | `node test.js quran <nomor_surah>` | Mendapatkan daftar ayat dalam satu surah (Contoh: `quran 1`). |
| **Doa List** | `node test.js doalist` | Menampilkan daftar doa-doa harian. |
| **Doa Detail** | `node test.js doa <nomor_doa>` | Mendapatkan teks Arab dan terjemahan doa spesifik. |

---

> [!TIP]
> Jika input mengandung spasi (seperti judul film atau teks brat), pastikan gunakan tanda kutip ganda `"..."`.
