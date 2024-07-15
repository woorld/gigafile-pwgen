const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const sourcePath = path.join(__dirname, '..', 'dist');
const outputPath = path.join(__dirname, '..', 'pack');

function outputLog(logHeader, messages) {
  console.log(`----pack: ${logHeader}----`);
  for (const message of messages) {
    console.log(message);
  }
}

// packディレクトリがない場合は作成
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

const manifest = fs.readFileSync(path.join(sourcePath, 'manifest.json'));
const zipName = `gigafile-pwgen_v${JSON.parse(manifest).version}.zip`;

// すでに同名のzipがある場合は削除
const zipPath = path.join(outputPath, zipName);
if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath);
}

const archive = archiver('zip', {
  zlib: { level: 9 },
});

archive.on('error', (e) => {
  outputLog('パッキング中にエラーが発生しました。', [e]);
});

const output = fs.createWriteStream(zipPath);

output.on('close', () => {
  outputLog('製品ビルドのパッキングが完了しました。', [
    `ファイル名:\t${zipName}`,
    `ファイルパス:\t${outputPath}`,
  ]);
});

archive.pipe(output);
archive.directory(sourcePath, false);
archive.finalize();
