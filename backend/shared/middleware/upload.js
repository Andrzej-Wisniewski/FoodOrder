import multer from 'multer';
import fs from 'fs';
import path from 'path';

const folder = 'images';

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder, { recursive: true });
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folder),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = sanitizeFilename(path.basename(file.originalname, ext));
    cb(null, `${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Niedozwolony format pliku.'));
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
