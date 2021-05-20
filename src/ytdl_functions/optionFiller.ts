import ytdl from 'ytdl-core';

const optionFiller = (data: ytdl.videoFormat[], typeOfData: ytdl.Filter) => {
  const optionSection: { value: any; label: string }[] = [];

  if (typeOfData === 'videoandaudio') {
    data.map((format) => {
      return optionSection.push({
        value: format.itag,
        label: `${format.qualityLabel} || ${format.container} || ${format.fps}FPS || ${format.audioSampleRate}kHz || itag: ${format.itag}`,
      });
    });
  } else if (typeOfData === 'videoonly') {
    data.map((format) => {
      return optionSection.push({
        value: format.itag,
        label: `${format.qualityLabel} || ${format.container} || ${format.fps}FPS || itag: ${format.itag}`,
      });
    });
  } else {
    data.map((format) => {
      return optionSection.push({
        value: format.itag,
        label: `${format.audioSampleRate}kHz || ${format.container} || itag: ${format.itag}`,
      });
    });
  }

  return optionSection;
};

export default optionFiller;
