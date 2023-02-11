const express = require('express');
const router = express.Router();
const Scene = require('../services/scene');
const helper = require('../helper');

/* GET Scene by page and order*/
router.get('/', async function (req, res, next) {
  try {
    res.json(await Scene.getMultiple(req.query.page, req.query.order));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

/* GET Scene by code */
router.get('/scene', async function (req, res, next) {
  try {
    res.json(await Scene.getScene(req.query.code));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

/* GET Scenes by limit */
router.get('/scenes', async function (req, res, next) {
  try {
    res.json(await Scene.getScenes(req.query.limit, req.query.order));
  } catch (err) {
    console.error(`Error while getting Scenes `, err.message);
    next(err);
  }
});

/* GET Scene by Id */
router.get('/sceneId', async function (req, res, next) {
  try {
    res.json(await Scene.getSceneId(req.query.id));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

/* GET related Scenes by Id Scene */
router.get('/relatedScenes', async function (req, res, next) {
  try {
    res.json(await Scene.getRelatedScenes(req.query.id, req.query.limit));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});


/* GET Scene by most views and limit */
router.get('/byviews', async function (req, res, next) {
  try {
    res.json(await Scene.getMostViewed(req.query.limit));
  } catch (err) {
    console.error(`Error while getting Scene `, err.message);
    next(err);
  }
});

/* GET All Scene */
router.get('/getAll', async function (req, res, next) {
  try {
    res.json(await Scene.getAll());
  } catch (err) {
    console.error(`Error while getting Scenes `, err.message);
    next(err);
  }
});

/* new view of scene*/
router.get('/newView', async function (req, res, next) {
  try {
    res.json(await Scene.getView(req.query.id));
  } catch (err) {
    console.error(`Error while creating view of Scene `, err.message);
    next(err);
  }
});

/* new scene */
router.post('/newScene', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await Scene.newScene(
      req.body.title,
      req.body.code,
      req.body.video,
      req.body.duration,
      req.body.hide,
      req.body.previewImage,
      req.body.staticImage,
      req.body.vtt,
      req.body.video480p,
      req.body.categories,
      req.body.idols));
  } catch (error) {
    next(error)
  }
});

/* delete scene */
router.delete('/deleteScene', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await Scene.deleteScene(
      req.body.code));
  } catch (error) {
    next(error)
  }
});

/* update scene */
router.patch('/updateScene', helper.isLoggedIn, async function (req, res, next) {
  try {
    res.json(await Scene.updateScene(
      req.body.id,
      req.body.title,
      req.body.code,
      req.body.video,
      req.body.duration,
      req.body.hide,
      req.body.previewImage,
      req.body.staticImage,
      req.body.vtt,
      req.body.video480p,
      req.body.categories,
      req.body.idols
    ));
  } catch (error) {
    next(error)
  }
});

module.exports = router;