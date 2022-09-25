const express = require('express');
const router = express.Router();
const categories = require('../services/category');

/* GET All Categories */
router.get('/', async function(req, res, next) {
  try {
    res.json(await categories.getAll());
  } catch (err) {
    console.error(`Error while getting Categories `, err.message);
    next(err);
  }
});

/* GET Scenes by Category */
router.get('/scenes', async function(req, res, next) {
  try {
    res.json(await categories.getScenes(req.query.page,req.query.name,req.query.order));
  } catch (err) {
    console.error(`Error while getting Categories `, err.message);
    next(err);
  }
});

module.exports = router;