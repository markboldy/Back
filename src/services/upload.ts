import multer from 'multer';
import { join, resolve } from 'path';
import { ALLOWED_FILES_FORMATS, DEFAULT_AVATAR_NAME, IMAGES_FOLDER_PATH } from '../utils/constants';
import { promisify } from 'util';
import fs from 'fs';

const unlink = promisify(fs.unlink);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(__dirname, `../..${IMAGES_FOLDER_PATH}`));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, `avatar-${Date.now()}-${fileName}`);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_FILES_FORMATS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

export const unlinkAvatar = (avatarPath: string): Promise<void> => {
  if (avatarPath === DEFAULT_AVATAR_NAME) {
    return Promise.resolve();
  }

  return unlink(`${join(__dirname, '../..', IMAGES_FOLDER_PATH)}${avatarPath}`);
}
