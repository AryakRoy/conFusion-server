var express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')

const User = require('../models/users')

var router = express.Router();
router.use(bodyParser.json())

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ err: err })
    }
    else {
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ status: 'Registration Successful', success: true })
      })
    }
  })
})

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: 'Login Successful', success: true })
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/')
  }
  else {
    var err = new Error('Your are not logged in!');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
