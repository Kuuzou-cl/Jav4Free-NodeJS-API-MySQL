const express = require('express');
const router = express.Router();
const idols = require('../services/idol');
const helper = require('../helper');

/* GET random Idols by limit */
router.get('/getrandombylimit', async function(req, res, next) {
  try {
    res.json(await idols.getRandomByLimit(req.query.limit));
  } catch (err) {
    console.error(`Error while getting random Idols `, err.message);
    next(err);
  }
});

router.get('/getidolbypage', async function(req, res, next) {
  try {
    res.json(await idols.getbypage(req.query.page));
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

router.get('/getjavbyidol', async function(req, res, next) {
  try {
    res.json(await idols.getJavByIdol(req.query.page,req.query.name));
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

router.get('/getIdols', async function(req, res, next) {
  try {
    res.json(await idols.getAll());
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

router.post('/newIdol', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await idols.newIdol(req.body.name,req.body.poster));  
  } catch (error) {
    next(error)
  }
});


/* New petitions V2 APP NUXT3 ---------------------------------------------------------------------------------------------------- */

router.get('/getIdolv2', async function(req, res, next) {
  try {
    res.json(await idols.getIdolV2(req.query.id));
  } catch (err) {
    console.error(`Error while getting Idol `, err.message);
    next(err);
  }
});

router.patch('/updateIdolv2', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await idols.updateIdolV2(req.body.id,req.body.name,req.body.image));  
  } catch (error) {
    next(error)
  }
});

module.exports = router;