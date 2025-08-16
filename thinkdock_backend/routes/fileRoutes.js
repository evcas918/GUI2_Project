const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

const upload = multer({ dest: 'temp/' });

router.post('/upload/:userId/:tool', upload.single('file'), fileController.uploadFile);
router.get('/download/:userId', fileController.downloadUserData);

module.exports = router;
