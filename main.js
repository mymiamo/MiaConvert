// main.js (güncellenmiş)
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const ytdlExec = require('youtube-dl-exec');

// ---------------------------------------------------------------------------
// yt-dlp yolu: önce resources/bin, yoksa asar.unpacked fallback
function getYtDlpPath() {
  const exe = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';

  // 1) resources/bin içi (extraResources ile kopyalanmışsa)
  const p1 = path.join(process.resourcesPath, 'bin', exe);
  if (fs.existsSync(p1)) return p1;

  // 2) asarUnpack ile çıkarılmış kopya
  const p2 = path.join(
    process.resourcesPath,
    'app.asar.unpacked',
    'node_modules',
    'youtube-dl-exec',
    exe
  );
  if (fs.existsSync(p2)) return p2;

  // 3) Geliştirme ortamı: modülün kökü
  try {
    const modRoot = path.dirname(require.resolve('youtube-dl-exec/package.json'));
    const p3 = path.join(modRoot, exe);
    if (fs.existsSync(p3)) return p3;
  } catch (_) { }

  // 4) Son çare: PATH'te (kullanıcı global yüklediyse)
  return exe;
}

// ffmpeg-static yolunu paketli (asar) ve geliştirme ortamında güvenli çöz
function getFfmpegPath() {
  const exe = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';

  // 1) resources/bin içinde mi?
  const p1 = path.join(process.resourcesPath, 'bin', exe);
  if (fs.existsSync(p1)) return p1;

  // 2) ffmpeg-static modülünden al, asar -> asar.unpacked düzeltmesi yap
  try {
    const ffmpegStatic = require('ffmpeg-static'); // string path döner
    if (ffmpegStatic) return ffmpegStatic.replace('app.asar', 'app.asar.unpacked');
  } catch (_) { /* ffmpeg-static yoksa PATH'teki ffmpeg denenir */ }

  // 3) Son çare: resourcesPath altında beklenen konum
  try {
    return path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      'node_modules',
      'ffmpeg-static',
      exe
    );
  } catch (_) { /* yoksay */ }

  return undefined;
}
const ffmpegForYtdlp = getFfmpegPath();

// Tek bir ytdlp nesnesi kullan: dev'de ytdlExec, paketliyken create(yol)
const ytdlp = app.isPackaged ? ytdlExec.create(getYtDlpPath()) : ytdlExec;

// ---------------------------------------------------------------------------
const downloads = new Map();

const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png')
  : path.join(__dirname, 'build', process.platform === 'win32' ? 'icon.ico' : 'icon.png');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 900,
    resizable: false,
    vibrancy: 'sidebar',            // macOS
    backgroundMaterial: 'mica',     // Windows 11
    icon: iconPath,
    webPreferences: {
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const menu = buildMenu(win);
  Menu.setApplicationMenu(menu);

  win.loadFile(path.join(__dirname, 'renderer', 'hello.html'));
}
function getIndexPath() {
  const candidates = [
    path.join(__dirname, 'hello.html'),                 // kökteyse
    path.join(__dirname, 'renderer', 'hello.html'),     // renderer/ altındaysa
    path.join(process.cwd(), 'hello.html'),             // dev fallback
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  // En olası olanı dene (hata ayıklama için)
  return path.join(__dirname, 'hello.html');
}



function buildMenu(win) {
  return Menu.buildFromTemplate([
    {
      label: '+ Yeni ',
      click: (menuItem, browserWindow) => {
        const win = browserWindow || BrowserWindow.getFocusedWindow();
        if (!win) return;
        win.loadFile(getIndexPath())
          .catch(err => console.error('loadFile error:', err));
      }

    },
    {
      label: 'Ana Sayfa',
      click: (menuItem, browserWindow) => {
        const win = browserWindow || BrowserWindow.getFocusedWindow();
        if (!win) return;
        win.loadFile(getIndexPath())
          .catch(err => console.error('loadFile error:', err));
      }

    },
    {
      label: 'Uygulama',
      submenu: [
        {
          label: 'Güncellemeleri Denetle',
          click: () => {
            const target = 'https://mymiamo.net/MiaConvert/update.html';
            win.loadURL(target).catch(err => console.error('loadURL error:', err));
          }
        },
        { type: 'separator' },
        { label: 'Çıkış', role: 'quit' }
      ]
    },

  ]);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

}

// Uygulama adı ve sürümünü renderer'a ver
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-app-name', () => app.getName());

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---------------------------------------------------------------------------
// Yardımcı: format seçimini kaliteye göre üretir (bv+ba adaptif)
function buildVideoFormat(quality) {
  const map = {
    best: 'bv*+ba/b',
    '2160p': 'bv*[height<=2160]+ba/b[height<=2160]',
    '1440p': 'bv*[height<=1440]+ba/b[height<=1440]',
    '1080p': 'bv*[height<=1080]+ba/b[height<=1080]',
    '720p': 'bv*[height<=720]+ba/b[height<=720]',
    '480p': 'bv*[height<=480]+ba/b[height<=480]',
    '360p': 'bv*[height<=360]+ba/b[height<=360]'
  };
  return map[quality] || map.best;
}

// ---------------------------------------------------------------------------
// IPC

ipcMain.handle('select-output-dir', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory']
  });
  return canceled || !filePaths[0] ? null : filePaths[0];
});

ipcMain.handle('start-download', async (_event, payload) => {
  const { url, kind, outDir, videoQuality, videoContainer, audioFormat } = payload;
  if (!url) throw new Error('URL gerekli');

  const baseOpts = {
    ffmpegLocation: ffmpegForYtdlp, // varsa ffmpeg-static, yoksa PATH
    o: path.join(outDir || app.getPath('downloads'), '%(title)s.%(ext)s'),
    newline: true,
    noWarnings: true
  };

  let opts = {};
  if (kind === 'audio') {
    opts = {
      ...baseOpts,
      x: true,
      audioFormat: audioFormat || 'mp3',
      audioQuality: '0' // en yüksek
    };
  } else {
    opts = {
      ...baseOpts,
      f: buildVideoFormat(videoQuality || 'best')
    };
    // Konteyner seçimi: mp4/mkv/mov (remux; yeniden kodlama yok)
    if (videoContainer) opts.remuxVideo = videoContainer;
  }

  const child = ytdlp.exec(url, opts, { stdio: ['ignore', 'pipe', 'pipe'] });
  const id = Date.now().toString();
  downloads.set(id, child);

  const send = (ch, data) => {
    for (const w of BrowserWindow.getAllWindows()) {
      try { w.webContents.send(ch, { id, ...data }); } catch { }
    }
  };

  const percentRe = /\[download\]\s+(\d+(?:\.\d+)?)%/;
  const onChunk = (buf) => {
    const text = buf.toString('utf8');
    const lines = text.split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      const m = line.match(percentRe);
      if (m) send('download-progress', { percent: Number(m[1]), line });
      else send('download-log', { line });
    }
  };

  child.stdout?.on('data', onChunk);
  child.stderr?.on('data', onChunk);

  child.on('close', (code) => {
    downloads.delete(id);
    send('download-done', { success: code === 0, code });
  });
  child.on('error', (err) => {
    downloads.delete(id);
    send('download-done', { success: false, error: err.message });
  });

  return { id };
});

ipcMain.handle('cancel-download', async (_event, id) => {
  const child = downloads.get(id);
  if (!child) return false;
  try {
    if (typeof child.cancel === 'function') child.cancel();
    else child.kill('SIGINT');
    downloads.delete(id);
    return true;
  } catch {
    return false;
  }
});
