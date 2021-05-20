import * as fs from 'fs';

import ytdl = require('ytdl-core');

const url = 'https://www.youtube.com/watch?v=KkhGkRahU6g';
const urlTwo = 'https://www.youtube.com/watch?v=K4lRfZyRD8k';
const urlThree = 'http://www.youtube.com/watch?v=aqz-KE-bpKQ';

const downloadVideo = async () => {
  const info = await ytdl.getInfo(urlThree);
  const formats = ytdl.filterFormats(info.formats, 'videoonly');
  console.log(formats);
  // const format = await ytdl.chooseFormat(info.formats, { quality: 18 });
  // console.log(format);
  // ytdl
  //   .downloadFromInfo(info, { quality: format.itag })
  //   .pipe(
  //     fs.createWriteStream(
  //       `${process.env.HOME}/Downloads/BRAP/brap.${format.container}`
  //     )
  //   );
};

downloadVideo();
