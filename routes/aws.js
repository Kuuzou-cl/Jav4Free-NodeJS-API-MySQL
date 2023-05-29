const express = require('express');
const router = express.Router();
const aws = require('../services/aws');
const s3 = require('../services/s3');

/* GET All files for Scenes*/
router.get('/stateFiles/', async function(req, res, next) {
  try {
    res.json(await aws.getStateFilesPublished(req.query.page));
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});

module.exports = router;