const express = require('express');
const router = express.Router();
const aws = require('../services/aws');
const s3 = require('../services/s3');

/* GET All files */
router.get('/getAll/', async function(req, res, next) {
  try {
    res.json(await aws.getAll());
  } catch (err) {
    console.error(`Error while getting scenes files from aws `, err.message);
    next(err);
  }
});

/* GET All files */
router.get('/getAllNotDB/', async function(req, res, next) {
  try {
    res.json(await aws.getAllNotDB());
  } catch (err) {
    console.error(`Error while getting scenes files from aws `, err.message);
    next(err);
  }
});

/* GET All files */
router.get('/checkS3/', async function(req, res, next) {
  try {
    res.json(await s3.getS3FilesMatch());
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});

module.exports = router;