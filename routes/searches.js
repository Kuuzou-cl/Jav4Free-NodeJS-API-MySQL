const express = require('express');
const router = express.Router();
const search = require('../services/search');

/* General search */
router.get('/userSearch', async function(req, res, next) {
  try {
    res.json(await search.getSearch(req.query.keyword,req.query.page));
  } catch (err) {
    console.error(`Error while getting anything `, err.message);
    next(err);
  }
});

module.exports = router;