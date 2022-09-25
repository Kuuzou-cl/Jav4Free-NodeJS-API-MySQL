const express = require('express');
const router = express.Router();
const javs = require('../services/jav');

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

/* GET Newest Javs by limit*/
router.get('/newest', async function(req, res, next) {
  try {
    res.json(await javs.getNewest(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

module.exports = router;