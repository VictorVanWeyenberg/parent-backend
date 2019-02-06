var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
let Ouder = mongoose.model('Ouder');
let Kind = mongoose.model('Kind');
let jwt = require('express-jwt');

let auth = jwt({ secret: process.env.PARENT_SECRET, userProperty: 'payload' });

router.param('ouder', function (req, res, next, id) {
  Ouder.findOne({ _id: id }, function(err, ouder) {
    if (err) return next(err);
    if (ouder) {
      req.ouder = ouder;
      return next();
    } else {
      res.status(401).json({ message: "Kon ouder niet vinden." });
    }
  });
});

router.get('/ouders', function(req, res, next) {
  Ouder.find({}).exec((err, ouders) => {
    if (err) return next(err);
    return res.json(ouders);
  });
});

router.post('/ouders', function(req, res, next) {
  let ouder = new Ouder(req.body);
  ouder.save(err => {
    console.log(err);
    if (err) return next(err);
    return res.json(ouder);
  });
});

router.post('/ouder/:ouder/kind/voegtoe', function(req, res, next) {
  let ouder = req.ouder;
  let kind = new Kind(req.body);
  kind.save(err => {
    if (err) return next(err);
    ouder.kinderen.push(kind);
    ouder.save(err => {
      if (err) {
        ouder.kinderen.splice(ouder.kinderen.length - 1, 1);
        return next(err);
      }
      return res.status(200).json(kind);
    });
  });
});

module.exports = router;
