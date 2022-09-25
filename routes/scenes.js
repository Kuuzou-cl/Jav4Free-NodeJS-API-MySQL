const express = require('express');
const router = express.Router();
const Scene = require('../services/scene');

/* GET Scene by page and order*/
router.get('/', async function(req, res, next) {
  try {
    res.json(await Scene.getMultiple(req.query.page,req.query.order));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

/* GET Scene by code */
router.get('/scene', async function(req, res, next) {
  try {
    res.json(await Scene.getScene(req.query.code));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

/* GET Scene by most views and limit */
router.get('/byviews', async function(req, res, next) {
  try {
    res.json(await Scene.getMostViewed(req.query.limit));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

module.exports = router;