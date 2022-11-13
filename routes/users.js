const express = require('express');
const router = express.Router();
const users = require('../services/user');
const helper = require('../helper');

/* Login */
router.post('/login', async function (req, res, next) {
  try {
    res.json(await users.login(req.body.email, req.body.password));
  } catch (err) {
    console.error(`Error while login `, err.message);
    next(err);
  }
});

router.post('/currentAlive', async function (req, res, next) {
  try {
    res.json(await users.tokenAlive(req.body.email, req.headers.authorization));  
  } catch (error) {
    next(error)
  }
});

module.exports = router;