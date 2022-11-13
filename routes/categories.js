const express = require('express');
const router = express.Router();
const categories = require('../services/category');
const helper = require('../helper');

/* GET All Categories */
router.get('/', async function(req, res, next) {
  try {
    res.json(await categories.getAll());
  } catch (err) {
    console.error(`Error while getting Categories `, err.message);
    next(err);
  }
});

/* GET Categories */
router.get('/getCategory', async function(req, res, next) {
  try {
    res.json(await categories.getCategory(req.query.id));
  } catch (err) {
    console.error(`Error while getting Category `, err.message);
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

/* new category */
router.post('/newCategory', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await categories.newCategory(req.body.name));  
  } catch (error) {
    next(error)
  }
});

/* update category */
router.patch('/updateCategory', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await categories.updateCategory(req.body.id,req.body.name));  
  } catch (error) {
    next(error)
  }
});

module.exports = router;