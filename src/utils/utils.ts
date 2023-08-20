import fs from 'fs';
import { promisify } from 'util';
import { DEFAULT_AVATAR_NAME } from './constants';

const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

export const deleteAllAvatars = async (absoluteFolderPath: string) => {
  try {
    const files = await readdir(absoluteFolderPath);
    const unlinkPromises = files.map((filename) => {
      if (filename === DEFAULT_AVATAR_NAME) {
        return Promise.resolve();
      }

      console.log('Deleting avatar: ', filename);
      return unlink(`${absoluteFolderPath}/${filename}`);
    });
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

export const isValidUrl = (str: string): boolean => {
  var urlRegex =
    '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
};

export const sanitizeObject = <T extends {}>(obj: T): T => {
  const sanitizedObj = {} as T;

  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '' && obj[key] !== 0) {
      sanitizedObj[key] = obj[key];
    }
  }

  return sanitizedObj;
}
