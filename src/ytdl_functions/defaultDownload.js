const ffmpeg = require('ffmpeg-static');

const ytdl = require('ytdl-core');
const cp = require('child_process');
const { ipcRenderer } = require('electron');

console.log('IPCRENDERER', ipcRenderer);

const startDownload = async (url) => {
  const tracker = {
    start: Date.now(),
    audio: { downloaded: 0, total: Infinity },
    video: { downloaded: 0, total: Infinity },
  };

  const title = await (await ytdl.getBasicInfo(url)).videoDetails.title;

  const sanitizedTitle = title.replace(/([!?,.\/])/g, ' ');

  console.log(sanitizedTitle);

  const audio = ytdl(url, { quality: 'highestaudio' }).on(
    'progress',
    (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    }
  );
  const video = ytdl(url, { quality: 'highestvideo' }).on(
    'progress',
    (_, downloaded, total) => {
      tracker.video = { downloaded, total };
    }
  );

  // Prepare the progress bar
  let progressbarHandle = null;
  const progressbarInterval = 5000;
  const sendProgress = () => {
    tracker.start = ((Date.now() - tracker.start) / 1000 / 60).toFixed(2);
    console.log('send progress');
    ipcRenderer.send('send_data_to_main', tracker);
  };

  let output;

  if (process.env.HOME && process.env.HOME.length > 0) {
    output = `${process.env.HOME}/Downloads/${sanitizedTitle}.mp4`;
  } else if (process.env.USERPROFILE && process.env.USERPROFILE.length > 0) {
    output = `${process.env.USERPROFILE}\\Downloads\\${sanitizedTitle}.mp4`;
  } else {
    output = `${title}.mp4`;
  }

  // Start the ffmpeg child process
  const ffmpegProcess = cp.spawn(
    ffmpeg,
    [
      // Remove ffmpeg's console spamming
      '-loglevel',
      '8',
      '-hide_banner',
      // Redirect/Enable progress messages
      '-progress',
      'pipe:3',
      // Set inputs
      '-i',
      'pipe:4',
      '-i',
      'pipe:5',
      // Map audio & video from streams
      '-map',
      '0:a',
      '-map',
      '1:v',
      // Keep encoding
      '-c:v',
      'copy',
      // Define output file
      '-y',
      output,
    ],
    {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        'inherit',
        'inherit',
        'inherit',
        /* Custom: pipe:3, pipe:4, pipe:5 */
        'pipe',
        'pipe',
        'pipe',
      ],
    }
  );

  ffmpegProcess.on('close', () => {
    console.log('done');
    // Cleanup
    clearInterval(progressbarHandle);
    console.log(progressbarHandle);
    ipcRenderer.send('process_finished', tracker);
    console.log(progressbarHandle);
  });

  ffmpegProcess.on('error', (err) => {
    console.error(err);
  });

  // Link streams
  // FFmpeg creates the transformer streams and we just have to insert / read data
  ffmpegProcess.stdio[3].on('data', () => {
    // Start the progress bar
    if (!progressbarHandle) {
      console.log('init progress bar');
      progressbarHandle = setInterval(sendProgress, progressbarInterval);
    }
  });

  audio.pipe(ffmpegProcess.stdio[4]);
  video.pipe(ffmpegProcess.stdio[5]);
};

const downloadHighestAudio = (url) => {};

export default startDownload;
