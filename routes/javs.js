const express = require('express');
const router = express.Router();
const javs = require('../services/jav');
const helper = require('../helper');

/* GET Javs Latest jav Homepage*/
router.get('/getlatest', async function(req, res, next) {
  try {
    res.json(await javs.getJavByLatest(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET Javs by code*/
router.get('/getjavbycode', async function(req, res, next) {
  try {
    res.json(await javs.getJavByCode(req.query.code));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});


//----------------------------

/* GET Javs by order and page*/
router.get('/getjavs', async function(req, res, next) {
  try {
    res.json(await javs.getJavs(req.query.page,req.query.hide,req.query.variable,req.query.order));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* GET latest Javs by limit*/
router.get('/getlatestjavs', async function(req, res, next) {
  try {
    res.json(await javs.getJavsByLatest(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

/* New jav view by id*/
router.get('/getJavViewById', async function (req, res, next) {
  try {
    res.json(await javs.getJavViewById(req.query.id));
  } catch (err) {
    console.error(`Error while creating view of Jav `, err.message);
    next(err);
  }
});





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

/* New petitions V2 APP NUXT3 ---------------------------------------------------------------------------------------------------- */

router.get('/v2', async function(req, res, next) {
  try {
    res.json(await javs.getMultipleV2(req.query.page,req.query.order));
  } catch (err) {
    console.error(`Error while getting Javs `, err.message);
    next(err);
  }
});

router.get('/javv2', async function(req, res, next) {
  try {
    res.json(await javs.getJavV2(req.query.code));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

router.get('/javIdv2', async function(req, res, next) {
  try {
    res.json(await javs.getJavIdV2(req.query.id));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

router.get('/newestv2', async function(req, res, next) {
  try {
    res.json(await javs.getNewestV2(req.query.limit));
  } catch (err) {
    console.error(`Error while getting newest Javs `, err.message);
    next(err);
  }
});

router.get('/getAllv2', async function(req, res, next) {
  try {
    res.json(await javs.getAllV2());
  } catch (err) {
    console.error(`Error while getting Javs `, err.message);
    next(err);
  }
});

router.post('/newJavv2', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.newJavV2(req.body.title,req.body.code,req.body.image,req.body.hide,req.body.categories,req.body.idols));  
  } catch (error) {
    next(error)
  }
});

router.patch('/updateJavv2', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await javs.updateJavV2(req.body.id,req.body.title,req.body.code,req.body.image,req.body.hide,req.body.categories,req.body.idols, req.body.scenes));  
  } catch (error) {
    next(error)
  }
});

router.get('/relatedJavsv2', async function (req, res, next) {
  try {
    res.json(await javs.getRelatedJavsV2(req.query.id, req.query.limit));
  } catch (err) {
    console.error(`Error while getting related Javs `, err.message);
    next(err);
  }
});

module.exports = router;