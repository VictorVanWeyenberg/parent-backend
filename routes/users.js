var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('User');
let Ouder = mongoose.model('Ouder');
let PasswordResetRequest = mongoose.model('PasswordResetRequest');
let passport = require('passport');

router.param('reset_id', function (req, res, next, id) {
  PasswordResetRequest.findOne({ _id : id }).exec((err, request) => {
    if (err) next(err);
    if (request) {
      req.request = request;
      return next();
    } else {
      return res.status(401).json({ message: "Kon aanvraag niet vinden." });
    }
  });
});

router.param('code', function(req, res, next, code) {
  req.code = code;
});

router.post('/register', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Sommige velden zijn leeg...' });
  }
  let user = new User();
  let ouder = new Ouder();
  ouder.email = req.body.email;
  ouder.save(err => {
    if (err) return next(err);  
    user.ouder = ouder;
    user.email = req.body.email;
    user.setPassword(req.body.password);
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

router.post('/reset', (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ message: 'Sommige velden zijn leeg...' });
  }
  let code = makeCode();
  let reset = new PasswordResetRequest({ email : req.body.email });
  reset.setCode(code);
  reset.save(err => {
    if (err) return next(err);
    return res.json({ id: reset._id, code: code });
  });
});

router.post('/reset/:reset_id/:code', (req, res, next) => {
  let request = req.request;
  let code = req.code;
  let password = req.body.password;
  if (request.validCode(code)) {
    User.findOne({ email: request.email }).exec((err, user) => {
      if (err) return next(err);
      if (user) {
        user.setPassword(password);
        user.save(err => {
          if (err) return res.status(400).json({ message: "Kon wachtwoord niet aanpassen. Neem contact op met de developers." })
        });
      } else {
        return res.status(400).json({ message: "Kon die gebruiker niet vinden." });
      }
    });
  }
});

router.post('/checkemail', (req, res, next) => {
  User.find({email: req.body.email}, (err, result) => {
    if (result.length) {
      res.json({ 'available': false });
    } else {
      res.json({ 'available': true });
    }
  });
});

function makeCode() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 12; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;
