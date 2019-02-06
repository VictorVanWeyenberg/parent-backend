var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');

router.post('/register', (req, res, next) => {
  if (!req.body.email || !req.body.pasword) {
    return res.status(400).json({ message: 'Sommige velden zijn leeg...' });
  }
  let user = new User();
  user.email = req.body.email;
  user.setPassword(req.body.pasword);
  user.save(err => {
    if (err) return next(err);
    return res.json({ token: user.generateJWT() });
  });
});

router.post('/login', (req, res, next) => {
  if (!req.body.email || !req.body.pasword) {
    return res.status(400).json({ message: 'Sommige velden zijn leeg...' });
  }
  password.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
