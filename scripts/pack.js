const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// TODO: ファイル名に現在のバージョンを含めるようにする
const sourcePath = path.join(__dirname, '..', 'dist');
const outputPath = path.join(__dirname, '..', 'pack');
const zipName = 'pack.zip';

// packディレクトリがない場合は作成
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const output = fs.createWriteStream(path.join(outputPath, zipName));

// すでに同名のzipがある場合は削除
if (fs.existsSync(path.join(outputPath, zipName))) {
  fs.rmSync(path.join(outputPath, zipName));
}

const archive = archiver('zip', {
  zlib: { level: 9 },
});

archive.pipe(output);
archive.directory(sourcePath, false);
archive.finalize();
