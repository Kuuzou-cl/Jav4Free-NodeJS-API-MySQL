const express = require('express');
const router = express.Router();
const javs = require('../services/jav');
const helper = require('../helper');

/* GET Javs Latest jav Homepage*/
router.get('/getlatest', async function(req, res, next) {
  try {
    res.json(await javs.getJavByLatest(req.query.limit,req.query.order));
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

router.get('/getjavbyviews', async function(req, res, next) {
  try {
    res.json(await javs.getJavByViews(req.query.page));
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

/* Get Jav History */
router.post('/historyJav', async function (req, res, next) {
  try {
    res.json(await javs.getHistoryJav(req.body.history, req.body.page));  
  } catch (error) {
    next(error)
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
    res.json(await javs.newJav(req.body.title,req.body.code,req.body.release_date,req.body.poster,req.body.hide,req.body.categories,req.body.idols));  
  } catch (error) {
    next(error)
  }
});

/* New Image Javs*/
router.post('/generateUploadUrl', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.generateUploadUrl());  
  } catch (error) {
    next(error)
  }
});

/* New Favorite Javs*/
router.post('/addFavorite', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.addFavorite(req.body.id,req.headers.authorization));  
  } catch (error) {
    next(error)
  }
});

/* Delete Favorite Javs*/
router.post('/deleteFavorite', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.deleteFavorite(req.body.id,req.headers.authorization));  
  } catch (error) {
    next(error)
  }
});

/* GET Javs by code*/
router.post('/checkFavorite', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.checkFavorite(req.body.id,req.headers.authorization));  
  } catch (error) {
    next(error)
  }
});

/* GET all favorite Javs by page*/
router.post('/getfavoritebypage', helper.isLoggedIn, async function(req, res, next) {
  try {
    res.json(await javs.getFavoriteJavByPage(req.body.param,req.body.order,req.body.page,req.headers.authorization));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

module.exports = router;