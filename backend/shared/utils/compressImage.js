import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function compressImage(inputFile, baseName) {
  const folder = 'images';

  const imageSizes = [
    { width: 800, height: 600, tag: '800' },
    { width: 600, height: 450, tag: '600' },
    { width: 400, height: 300, tag: '400' },
  ];

  const files = [];

  for (const size of imageSizes) {
    const outName = `${baseName}-${size.tag}.webp`;
    const outPath = path.join(folder, outName);

    await sharp(inputFile)
      .resize(size.width, size.height, { fit: 'cover' })
      .webp({ quality: 75, method: 6 })
      .toFile(outPath);

    files.push(outName);
  }

  if (fs.existsSync(inputFile)) {
    fs.unlinkSync(inputFile);
  }

  return files;
}
