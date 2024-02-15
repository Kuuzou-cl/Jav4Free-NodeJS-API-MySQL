const express = require('express');
const router = express.Router();
const categories = require('../services/category');
const helper = require('../helper');

/* Get Hot Categories HomePage*/
router.get('/getHotCategories', async function(req, res, next) {
  try {
    res.json(await categories.getHotCategories(req.query.limit));
  } catch (err) {
    console.error(`Error while getting Categories `, err.message);
    next(err);
  }
});

/* GET All Categories */
router.get('/getCategories', async function(req, res, next) {
  try {
    res.json(await categories.getCategories());
  } catch (err) {
    console.error(`Error while getting Categories `, err.message);
    next(err);
  }
});

/* GET javs by Category */
router.get('/getJavsByCategories', async function(req, res, next) {
  try {
    res.json(await categories.getJavsByCategories(req.query.page,req.query.name));
  } catch (err) {
    console.error(`Error while getting Javs `, err.message);
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