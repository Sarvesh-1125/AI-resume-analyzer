const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, matchJob, chat, generateSOP } = require('../controllers/resumeController');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/analyze', upload.single('resume'), analyzeResume);
router.post('/match', matchJob);

router.post('/chat', chat);
router.post('/generate-sop', generateSOP);
module.exports = router;
