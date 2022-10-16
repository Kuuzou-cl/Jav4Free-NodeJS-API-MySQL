const express = require('express');
const router = express.Router();
const aws = require('../services/aws');

/* GET All files */
router.get('/', async function(req, res, next) {
  try {
    res.json(await aws.getAll());
  } catch (err) {
    console.error(`Error while getting files from aws `, err.message);
    next(err);
  }
});

module.exports = router;