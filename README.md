Harika — dosyaları göndermen gerekmeden işe yarar, hazır bir **README.md** yazdım. (Ekran görüntüsü/logo gibi şeyler paylaşırsan, yerlerini doldurur ve bağlantıları eklerim.)
Aşağıda **Türkçe** ve **İngilizce** bölümler birlikte; tek dosyada kullanabilirsin.

---

# MiaConvert

> YouTube’dan video/ses indirme ve dönüştürme aracı (Electron).
> A free, Electron-based downloader & converter for YouTube.

[TR](#-türkçe) • [EN](#-english)

---

## 🇹🇷 Türkçe

### ✨ Özellikler

* YouTube’dan **ücretsiz** video veya ses indirin.
* **Ses formatları:** `opus`, `mp3`, `m4a`
* **Video formatları:** `mp4`, `mkv` + **kalite seçimi**
* **Yerleşik araçlar:** `ffmpeg` ve `yt-dlp` uygulama ile birlikte gelir (internet gerekmeden dönüştürür).
* Windows 10/11 (x64) desteği.

> ⚠️ Lütfen yerel yasalara ve YouTube’un kullanım şartlarına uyun; telif haklarına saygı gösterin.

---

### 📦 İndir & Kur

**Önerilen:** GitHub **Releases** bölümünden en güncel sürümü indirin.

* **Kurulum (NSIS):** `MiaConvert-<sürüm>-x64.exe`
  Kısayol, kaldırma, daha hızlı açılış sağlar.
* **Kurulumsuz klasör:** `MiaConvert-<sürüm>-x64.zip`
  ZIP’i çıkarın ve klasördeki `MiaConvert.exe`’yi çalıştırın.

> Not: “Portable .exe” tek dosya sürümleri her açılışta kendini geçici klasöre çıkardığı için daha **yavaş** açılabilir. Bu yüzden **NSIS kurulum** veya **ZIP klasör** tercih edilir.

---

### 🚀 Kullanım

1. Uygulamayı açın.
2. YouTube bağlantısını yapıştırın (tek link veya birden fazla).
3. **Çıktı türü**nü seçin: *Video* (`mp4`/`mkv`) veya *Ses* (`opus`/`mp3`/`m4a`).
4. (Video için) **kalite** seçin.
5. **İndir/Dönüştür**’e tıklayın. İşlem ilerlemesi ekranda görüntülenir.
6. Çıktı klasörü uygulama içinde belirtilir (varsayılan olarak kullanıcı klasörünüz altında bir alt klasör olabilir).

---

### 🔧 Teknik Bilgiler

* **Teknolojiler:** Electron, Node.js
* **Bağımlılıklar:**

  * `yt-dlp` (via `youtube-dl-exec`) → `resources/bin/yt-dlp.exe` içine kopyalanır
  * `ffmpeg` (via `ffmpeg-static`) → `resources/bin/ffmpeg.exe` içine kopyalanır
* **ASAR:** Uygulama kodu `asar` içinde paketlenir; harici `.exe` araçlar `extraResources/bin` altındadır.

Uygulama içinden harici ikililere erişim örneği:

```js
const path = require('path');
const { app } = require('electron');
const binPath = (name) =>
  path.join(app.isPackaged ? process.resourcesPath : __dirname, 'bin', name);

const ffmpeg = binPath('ffmpeg.exe');
const ytdlp  = binPath('yt-dlp.exe');
```

---

### 🧑‍💻 Geliştirme (Kaynak Koddan Çalıştırma)

**Gereksinimler:** Windows 10/11 x64, Node.js 18+ (öneri 20), Git.

```bash
# Depoyu klonla
git clone <repo-url>
cd MiaConvert

# Bağımlılıklar
npm ci

# Geliştirme
npm run dev   # electron .

# Üretim (NSIS kurulum)
npm run build:nsis

# İsteğe bağlı: ZIP klasör çıktısı
npm run build:zip
```

> `package.json` içindeki başlıca script’ler:
> `dev`, `build:nsis`, `build:zip` (projene göre uyarlayabilirsin).

---

### 🔐 İmzalama (opsiyonel ama önerilir)

* Açık kaynak projeler için **ücretsiz** CI tabanlı imzalama servisleri (örn. SignPath) veya **Microsoft Store’a MSIX** yayınlama tercih edilebilir.
* Kendi sertifikan varsa `electron-builder` ile `CSC_LINK` / `CSC_KEY_PASSWORD` değişkenleriyle otomatik imzalayabilirsin.

---

### ❓ SSS / Sorun Giderme

* **SmartScreen uyarısı görüyorum:** İmzalı kurulum dosyası kullanın; ilk indirmelerde itibar oluşana kadar uyarı çıkabilir.
* **Portable sürüm yavaş açılıyor:** Portable tek dosya her açılışta kendini çıkarır; **NSIS** veya **ZIP** kullanın.
* **İndirme başarısız:** Bağlantıyı kontrol edin; videonun bölge/yaş/üye kısıtları olabilir.

---

### 🤝 Katkı

* Hata bildirimleri ve öneriler için **Issues** açın.
* PR’lar hoş geldiniz. Basit bir kod stili/format (Prettier/ESLint) kullanmanız önerilir.

---

### 📄 Lisans

Bu projeye uygun bir lisans seçin (ör. **MIT**). Eğer zaten bir lisans dosyanız varsa burayı ona göre güncelleyin.

---

## 🇬🇧 English

### ✨ Features

* Download **free** video or audio from YouTube.
* **Audio:** `opus`, `mp3`, `m4a`
* **Video:** `mp4`, `mkv` with **quality selection**
* **Bundled tools:** `ffmpeg` and `yt-dlp` ship with the app (offline conversions).
* Supports Windows 10/11 (x64).

> ⚠️ Use responsibly and comply with local laws and YouTube’s Terms of Service; respect copyrights.

---

### 📦 Download & Install

Grab the latest builds from GitHub **Releases**.

* **Installer (NSIS, recommended):** `MiaConvert-<version>-x64.exe`
  Adds shortcuts, uninstaller, and starts faster.
* **Portable folder:** `MiaConvert-<version>-x64.zip`
  Extract and run `MiaConvert.exe`.

> Note: Single-file “portable .exe” builds can start **slower** (self-extract at runtime). Prefer **NSIS** or **ZIP**.

---

### 🚀 Usage

1. Launch the app.
2. Paste a YouTube URL (single or multiple).
3. Choose **output type**: *Video* (`mp4`/`mkv`) or *Audio* (`opus`/`mp3`/`m4a`).
4. (For video) select **quality**.
5. Click **Download/Convert** and watch the progress.
6. The output folder is shown in the app (by default inside your user directory).

---

### 🔧 Technical Notes

* **Stack:** Electron, Node.js
* **Dependencies:**

  * `yt-dlp` (via `youtube-dl-exec`) → copied to `resources/bin/yt-dlp.exe`
  * `ffmpeg` (via `ffmpeg-static`) → copied to `resources/bin/ffmpeg.exe`
* **ASAR:** App code is packed; external tools live under `extraResources/bin`.

Accessing bundled binaries:

```js
const path = require('path');
const { app } = require('electron');
const binPath = (name) =>
  path.join(app.isPackaged ? process.resourcesPath : __dirname, 'bin', name);

const ffmpeg = binPath('ffmpeg.exe');
const ytdlp  = binPath('yt-dlp.exe');
```

---

### 🧑‍💻 Development (Build from Source)

**Requirements:** Windows 10/11 x64, Node.js 18+ (20 recommended), Git.

```bash
git clone <repo-url>
cd MiaConvert
npm ci

# Dev
npm run dev

# Production (NSIS installer)
npm run build:nsis

# Optional ZIP build
npm run build:zip
```

---

### 🔐 Code Signing (optional)

* For OSS, you can use **free** CI-based signing (e.g., SignPath) or publish as **MSIX** via Microsoft Store.
* With your own cert, set `CSC_LINK` / `CSC_KEY_PASSWORD` for electron-builder.

---

### ❓ FAQ / Troubleshooting

* **SmartScreen warnings:** Use a signed installer; reputation builds over time.
* **Slow startup (portable):** Single-file portable extracts on each run; prefer NSIS/ZIP.
* **Download fails:** Check the URL; region/age/member-only restrictions may apply.

---

### 🤝 Contributing

* File bugs and suggestions under **Issues**.
* PRs welcome. Please use a consistent code style (Prettier/ESLint recommended).

---

### 📄 License

Choose a suitable license (e.g., **MIT**). Update this section if you already have one.

---


