const express = require('express');
const router = express.Router();
import { listFiles } from '../services/s3';

// List All Files from S3
router.get('/list', async (req, res) => {
  const { success, data } = await listFiles()
  if (success) {
    return res.json({ success, data })
  }
  return res.status(500).json({ success: false, message: 'Error Occured !!!'})
});

module.exports = router;