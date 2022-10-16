const express = require('express');
const router = express.Router();
const aws = require('../services/aws');

/* GET All files */
router.get('/getScenes/', async function(req, res, next) {
  try {
    res.json(await aws.getScenes());
  } catch (err) {
    console.error(`Error while getting scenes files from aws `, err.message);
    next(err);
  }
});

module.exports = router;