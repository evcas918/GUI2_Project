const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

exports.zipUserFolder = (folderPath, callback) => {
  const zip = new AdmZip();
  const zipName = `${path.basename(folderPath)}.zip`;
  const zipPath = path.join(__dirname, '..', 'temp', zipName);

  try {
    zip.addLocalFolder(folderPath);
    zip.writeZip(zipPath);
    callback(null, zipPath);
  } catch (err) {
    callback(err);
  }
};
