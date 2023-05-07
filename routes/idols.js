const express = require('express');
const router = express.Router();
const idols = require('../services/idol');
const helper = require('../helper');

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

/* GET all Idols */
router.get('/getAll', async function(req, res, next) {
  try {
    res.json(await idols.getAll());
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

/* new idol */
router.post('/newIdol', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await idols.newIdol(req.body.name,req.body.image,req.body.hide));  
  } catch (error) {
    next(error)
  }
});

/* GET Idol */
router.get('/getIdol', async function(req, res, next) {
  try {
    res.json(await idols.getIdol(req.query.id));
  } catch (err) {
    console.error(`Error while getting Idol `, err.message);
    next(err);
  }
});

/* update idol */
router.patch('/updateIdol', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await idols.updateIdol(req.body.id,req.body.name,req.body.image));  
  } catch (error) {
    next(error)
  }
});

/* New petitions V2 APP NUXT3 ---------------------------------------------------------------------------------------------------- */

router.get('/', async function(req, res, next) {
  try {
    res.json(await idols.getMultipleV2(req.query.page,req.query.order));
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

router.get('/scenes', async function(req, res, next) {
  try {
    res.json(await idols.getScenesV2(req.query.page,req.query.name,req.query.order));
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

router.get('/featured', async function(req, res, next) {
  try {
    res.json(await idols.getFeaturedV2(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Idols `, err.message);
    next(err);
  }
});

router.get('/getAll', async function(req, res, next) {
  try {
    res.json(await idols.getAllV2());
  } catch (err) {
    console.error(`Error while getting Idols `, err.message);
    next(err);
  }
});

router.post('/newIdol', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await idols.newIdolV2(req.body.name,req.body.image,req.body.hide));  
  } catch (error) {
    next(error)
  }
});

router.get('/getIdol', async function(req, res, next) {
  try {
    res.json(await idols.getIdolV2(req.query.id));
  } catch (err) {
    console.error(`Error while getting Idol `, err.message);
    next(err);
  }
});

router.patch('/updateIdol', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await idols.updateIdolV2(req.body.id,req.body.name,req.body.image));  
  } catch (error) {
    next(error)
  }
});

module.exports = router;