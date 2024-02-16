const express = require('express');
const router = express.Router();
const javs = require('../services/jav');
const helper = require('../helper');

/* GET Javs Latest jav Homepage*/
router.get('/getlatest', async function(req, res, next) {
  try {
    res.json(await javs.getJavByLatest(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Javs by code*/
router.get('/getjavbycode', async function(req, res, next) {
  try {
    res.json(await javs.getJavByCode(req.query.code));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Javs Random jav page*/
router.get('/getrandom', async function(req, res, next) {
  try {
    res.json(await javs.getJavByLatest(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Javs by order and page*/
router.get('/getjavbypage', async function(req, res, next) {
  try {
    res.json(await javs.getJavByPage(req.query.page));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});


/* GET all Javs by order and page*/
router.get('/getalljavbypage', async function(req, res, next) {
  try {
    res.json(await javs.getAllJavByPage(req.query.page));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Javs by code*/
router.get('/getjavbyid', async function(req, res, next) {
  try {
    res.json(await javs.getJavById(req.query.id));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* Patch Javs by id*/
router.patch('/updateJav', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.updateJav(req.body.id,req.body.title,req.body.code,req.body.release_date,req.body.video,req.body.static,req.body.preview,req.body.poster,req.body.vtt,req.body.hide,req.body.categories,req.body.idols));  
  } catch (error) {
    next(error)
  }
});

/* Create Javs*/
router.post('/newJav', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.newJavV2(req.body.title,req.body.code,req.body.image,req.body.hide,req.body.categories,req.body.idols));  
  } catch (error) {
    next(error)
  }
});

module.exports = router;