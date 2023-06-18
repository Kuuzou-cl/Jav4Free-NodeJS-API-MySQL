const express = require('express');
const router = express.Router();
const aws = require('../services/aws');
const s3 = require('../services/s3');

/* GET All files for Scenes*/
router.get('/stateFiles/scenes/', async function(req, res, next) {
  try {
    res.json(await aws.getStateFilesScenes(req.query.page));
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});

/* GET All files for Javs*/
router.get('/stateFiles/javs/', async function(req, res, next) {
  try {
    res.json(await aws.getStateFilesJavs(req.query.page));
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});

/* GET All files for Idols*/
router.get('/stateFiles/idols/', async function(req, res, next) {
  try {
    res.json(await aws.getStateFilesIdols(req.query.page));
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});

/* GET All files pending*/
router.get('/stateFiles/pending/', async function(req, res, next) {
  try {
    res.json(await aws.getPendingFiles());
  } catch (err) {
    console.error(`Error while checking DB`, err.message);
    next(err);
  }
});

module.exports = router;