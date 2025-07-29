const fs = require('fs');
const path = require('path');
const { zipUserFolder } = require('../utils/zipUtils');

exports.uploadFile = (req, res) => {
  const { userId, tool } = req.params;
  const userDir = path.join(__dirname, '..', 'user-data', userId);
  const ext = path.extname(req.file.originalname);
  const destPath = path.join(userDir, `${tool}${ext}`);

  fs.mkdirSync(userDir, { recursive: true });
  fs.rename(req.file.path, destPath, err => {
    if (err) return res.status(500).json({ error: 'File save error' });
    res.json({ message: 'File uploaded successfully' });
  });
};

exports.downloadUserData = (req, res) => {
  const { userId } = req.params;
  const folderPath = path.join(__dirname, '..', 'user-data', userId);

  zipUserFolder(folderPath, (err, zipPath) => {
    if (err) return res.status(500).json({ error: 'Zip creation failed' });
    res.download(zipPath, `${userId}_thinkdock.zip`, () => {
      fs.unlinkSync(zipPath); // Clean up zip file
    });
  });
};
