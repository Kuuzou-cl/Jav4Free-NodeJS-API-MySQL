const express = require('express');
const router = express.Router();
const idols = require('../services/idol');

/* GET Idol by page and offset */
router.get('/', async function(req, res, next) {
  try {
    res.json(await idols.getMultiple(req.query.page,req.query.order));
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

/* GET Scenes by Idol */
router.get('/scenes', async function(req, res, next) {
  try {
    res.json(await idols.getScenes(req.query.page,req.query.name,req.query.order));
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});
/* GET Random Idols by limit*/
router.get('/featured', async function(req, res, next) {
  try {
    res.json(await idols.getFeatured(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Idols `, err.message);
    next(err);
  }
});

module.exports = router;