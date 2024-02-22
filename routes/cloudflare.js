const express = require('express');
const router = express.Router();
const cloudflare = require('../services/cloudflare');

/* GET All files for Scenes*/
router.get('/list_bucket', async function(req, res, next) {
  try {
    res.json(await cloudflare.listBucket());
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});


module.exports = router;