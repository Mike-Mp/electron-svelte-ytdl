import * as fs from 'fs';

import ytdl = require('ytdl-core');

// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

// const url11 = 'http://www.youtube.com/watch?v=aqz-KE-bpKQ';

export const validateVideoURL = (url: string) => {
  const validation = ytdl.validateURL(url);
  return validation;
};

export const validateVideoID = (videoID: string) => {
  const validation = ytdl.validateID(videoID);
  return validation;
};

const urlOrId = (str: string) => {
  let rawStr;
  let validation;
  if (str.startsWith('www')) {
    rawStr = `https://${str}`;
    validation = validateVideoURL(rawStr);
  } else if (str.startsWith('http')) {
    validation = validateVideoURL(str);
  } else {
    validation = validateVideoID(str);
  }

  return validation;
};

export const getVideoDetails = async (url: string) => {
  if (!urlOrId(url)) return { msg: 'Error: Invalid video URL/id' };

  const info = await ytdl.getInfo(url);

  const details = info.videoDetails;

  const videoLengthInSeconds = parseInt(details.lengthSeconds, 10);

  const videoDateObject = new Date(videoLengthInSeconds * 1000);

  const timeString = videoDateObject.toISOString().substr(11, 8);

  return { details, timeString };
};

export const getTitle = async (url: string) => {
  if (!urlOrId(url)) return 'Error: Invalid video URL/id';
  const { title } = (await ytdl.getBasicInfo(url)).videoDetails;
  return title;
};

export const getTitleAndImage = async (url: string) => {
  if (!urlOrId(url)) return 'Error: Invalid video URL/id';
  const info = await ytdl.getBasicInfo(url);
  console.log(info.videoDetails);

  const { title } = info.videoDetails;
};

export const getFormats = async (url: string, typeOf: ytdl.Filter) => {
  if (!urlOrId(url)) return [{ msg: 'Error: Invalid video URL/id' }];

  const info = await ytdl.getInfo(url);
  const format = ytdl.filterFormats(info.formats, typeOf);

  const resolvedFormat = Promise.resolve(format)
    .then((res) => res)
    .catch((err) => {
      const errObj = [err];
      console.log('braaaap');
      return errObj;
    });

  return resolvedFormat;
};

export const chosenDownload = async (
  url: string,
  itag: string,
  formatType: ytdl.Filter,
  filePaths: string[]
) => {};
