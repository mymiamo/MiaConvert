# MiaConvert

> **Uyarı (TOS/Yasal):** Bu proje eğitim amaçlıdır. YouTube’un Hizmet Şartları içerik sahibi izni veya platformun resmi indirme özelliği (örn. Premium) dışında indirmeye izin vermez. Lütfen yasalara ve TOS’a uyunuz.

## Kurulum

```bash
npm install
npm start
```

- Python 3.7+ sisteminizde bulunmalıdır (youtube-dl-exec gereksinimi).
- ffmpeg-static proje içinde otomatik sağlanır.

## Özellikler
- Video/Ses modu
- **Kalite** seçimi (Best, 2160p … 360p)
- **Kapsayıcı/uzantı** seçimi: Video için `mp4`, `mkv`, `mov`; Ses için `mp3`, `opus`, `m4a`
- İlerleme çubuğu, iptal desteği

## Teknik

- İndirme `youtube-dl-exec@^3` ile yapılır; canlı çıktı için `.exec()` kullanılır, bu nedenle eski örneklerdeki `.raw` yerine `youtubedl.exec(url, opts, { stdio })` kullanıyoruz.
- Video kapsayıcısı seçimi için `--remux-video` bayrağı kullanılır (yeniden kodlamasız remux). Ses için `-x --audio-format <fmt>`.

