import fs from 'fs-extra';

(async () => {
  const music = '/mnt/Manjaro_Data/zougui/Audio/Music/German Musik/004 Jubel.mp3';
  const stats = await fs.stat(music);
  console.log(stats.size / 1024)
})();
