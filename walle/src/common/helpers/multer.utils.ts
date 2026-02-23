import { extname } from 'path';

export const RandomName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};

export const FSUFilterFiles = (req, file, callback) => {
    if (!(file.originalname.toLowerCase()).match(/\.(dat|DAT)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

export const geofenceFileFilter = (req, file, callback) => {
  if (!(file.originalname.toLowerCase()).match(/\.(xls|xlsx|kml|kmz)$/)) {
    return callback(new Error('Format incorrect!'), false);
  }
  callback(null, true);
};