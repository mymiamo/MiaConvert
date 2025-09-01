// renderer/renderer.js
const $ = (s) => document.querySelector(s);

let currentId = null;
let outDir = null;

const modeSel = $('#mode');
const videoExtGroup = $('#video-ext-group');
const audioExtGroup = $('#audio-ext-group');
const qualityGroup = $('#quality-group');

function applyModeUI() {
  const mode = modeSel.value;
  const isVideo = mode === 'video';
  videoExtGroup.style.display = isVideo ? '' : 'none';
  qualityGroup.style.display = isVideo ? '' : 'none';
  audioExtGroup.style.display = isVideo ? 'none' : '';
}
modeSel.addEventListener('change', applyModeUI);
applyModeUI();

$('#choose').addEventListener('click', async () => {
  outDir = await window.api.selectOutputDir();
  $('#outDir').textContent = outDir || '';
});

$('#start').addEventListener('click', async () => {
  const url = $('#url').value.trim();
  if (!url) return alert('Lütfen bir URL girin');

  const kind = $('#mode').value;
  const payload = {
    url,
    kind,
    outDir,
    videoQuality: $('#videoQuality').value,
    videoContainer: $('#videoContainer').value,
    audioFormat: $('#audioFormat').value
  };

  $('#log').textContent = '';
  $('#bar').value = 0;
  $('#percent').textContent = '%0';

  const { id } = await window.api.startDownload(payload);
  currentId = id;
  $('#cancel').disabled = false;
});

$('#cancel').addEventListener('click', async () => {
  if (!currentId) return;
  const ok = await window.api.cancelDownload(currentId);
  if (!ok) alert('İptal edilemedi');
});

window.api.onProgress(({ percent, line }) => {
  $('#bar').value = Math.max(0, Math.min(100, percent));
  $('#percent').textContent = `%${percent.toFixed(1)}`;
  if (line) append(line);
});
window.api.onLog(({ line }) => { if (line) append(line); });
window.api.onDone(({ success, code, error }) => {
  append(success ? `\n✔ Bitti (code=${code})` : `\n✖ Hata: ${error || code}`);
  $('#cancel').disabled = true;
  currentId = null;
});

function append(line) {
  const log = $('#log');
  log.textContent += (line + "\n");
  log.scrollTop = log.scrollHeight;
}
