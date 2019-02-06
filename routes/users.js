var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Ouder = mongoose.model('Ouder');
let passport = require('passport');

router.post('/register', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Sommige velden zijn leeg...' });
  }
  let user = new User();
  let ouder = new Ouder();
  user.ouder = ouder;
  user.ouder.email = req.body.email;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  ouder.save(err => {
    if (err) return next(err);
    user.save(err2 => {
      if (err2) {
        Ouder.findOneAndRemove(ouder);
        return next(err2);
      }
      return res.json({ token: user.generateJWT() });
    });
  });
});

router.post('/login', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Sommige velden zijn leeg...' });
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })({ body: { username: req.body.email, password: req.body.password } }, res, next);
});

module.exports = router;
