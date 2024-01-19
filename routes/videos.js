const express = require('express');
const router = express.Router();
const videos = require('../services/video.js');
const helper = require('../helper');

/* GET Videos Latest videos Homepage*/
router.get('/getlatest', async function(req, res, next) {
    try {
      res.json(await videos.getVideoByLatest(req.query.limit));
    } catch (err) {
      console.error(`Error while getting newest videos `, err.message);
      next(err);
    }
  });

module.exports = router;