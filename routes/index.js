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
      return res.status(401).json({ message: "Kon ouder niet vinden." });
    }
  });
});

router.param('ouder_populated', function (req, res, next, id) {
  Ouder.findOne({ _id: id }).populate("lists.kinderen").exec(function(err, ouder) {
    if (err) return next(err);
    if (ouder) {
      console.log(ouder);
      req.ouder = ouder;
      return next();
    } else {
      return res.status(401).json({ message: "Kon ouder niet vinden." });
    }
  })
});

router.param('kind', function (req, res, next, id) {
  Kind.findOne({ _id: id }, function(err, kind) {
    if (err) return next(err);
    if (kind) {
      req.kind = kind;
      return next();
    } else {
      res.status(401).json({ message: "Kon kind niet vinden." });
    }
  });
});

router.get('/ouders', function(req, res, next) {
  Ouder.find({}).populate('lists.kinderen').exec((err, ouders) => {
    if (err) return next(err);
    return res.json(ouders);
  });
});

router.post('/ouders', function(req, res, next) {
  let ouder = new Ouder(req.body);
  ouder.save(err => {
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

router.post('/ouder/:ouder/update', function(req, res, next) {
  let ouder = req.ouder;
  let update = req.body;
  update.updateDatum = new Date();
  Ouder.update(ouder, update, (err) => {
    if (err) return next(err);
    res.json(ouder);
  });
});

router.post('/kind/:kind/update', function(req, res, next) {
  let kind = req.kind;
  let update = req.body;
  update.updateDatum = new Date();
  Kind.update(kind, update, (err) => {
    if (err) return next(err);
    res.json(kind);
  });
});

router.delete('/ouder/:ouder/delete/:kind', function(req, res, next) {
  let ouder = req.ouder;
  let kind = req.kind;
  Kind.deleteOne(kind, (err) => {
    if (err) return next(err);
    ouder.kinderen.remove(kind);
    ouder.save((err) => {
      if (err) return next(err);
      res.json(kind);
    });
  });
});

router.get('/ouder/:ouder', function(req, res) {
  res.json(req.ouder);
});

router.get('/ouder/:ouder_populated/kinderen', function(req, res) {
  res.json(req.ouder.kinderen);
});



module.exports = router;
