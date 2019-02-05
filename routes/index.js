var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
let Ouder = mongoose.model('Ouder');

router.get('/test', (req, res, next) => {
  return res.json('pong');
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

module.exports = router;
