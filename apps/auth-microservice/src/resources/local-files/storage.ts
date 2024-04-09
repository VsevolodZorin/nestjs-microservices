import * as dotenv from 'dotenv';
import { diskStorage } from 'multer';
import * as path from 'path';

dotenv.config();

const uploadsDir = process.env.UPLOADS_DIR || 'uploads';
const rootDir = process.cwd();
const storageDir = path.join(rootDir, uploadsDir);

const generateId = () =>
  Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');

const normalizeFileName = (req, file, cb) => {
  const fileExtName = file.originalname.split('.').pop();

  cb(null, `${generateId()}.${fileExtName}`);
};

export const fileStorage = diskStorage({
  destination: storageDir,
  filename: normalizeFileName,
});
