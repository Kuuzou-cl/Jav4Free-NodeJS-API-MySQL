const express = require('express');
const router = express.Router();
const javs = require('../services/jav');
const helper = require('../helper');

/* GET Javs by page and offset */
router.get('/', async function(req, res, next) {
  try {
    res.json(await javs.getMultiple(req.query.page,req.query.order));
  } catch (err) {
    console.error(`Error while getting Javs `, err.message);
    next(err);
  }
});

/* GET Javs by code*/
router.get('/jav', async function(req, res, next) {
  try {
    res.json(await javs.getJav(req.query.code));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Javs by id*/
router.get('/javId', async function(req, res, next) {
  try {
    res.json(await javs.getJavId(req.query.id));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Newest Javs by limit*/
router.get('/newest', async function(req, res, next) {
  try {
    res.json(await javs.getNewest(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET All Javs */
router.get('/getAll', async function(req, res, next) {
  try {
    res.json(await javs.getAll());
  } catch (err) {
    console.error(`Error while getting Javs `, err.message);
    next(err);
  }
});

/* new jav */
router.post('/newJav', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.newJav(req.body.title,req.body.code,req.body.image,req.body.hide,req.body.categories,req.body.idols));  
  } catch (error) {
    next(error)
  }
});

/* update jav */
router.patch('/updateJav', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.updateJav(req.body.id,req.body.title,req.body.code,req.body.image,req.body.hide,req.body.categories,req.body.idols, req.body.scenes));  
  } catch (error) {
    next(error)
  }
});

module.exports = router;