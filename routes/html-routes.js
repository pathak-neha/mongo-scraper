// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require('path');

// Routes
// =============================================================
var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var db = require('../models');
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapenews";
//mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// lost route loads lost.html

//Create all our routes and set up logic within those routes where required.

router.get('/', function (req, res) {
    console.log("enter index in html-router");
    db.Article.find({ saved: false })
    .then(function (dbArticle) {
        res.render("index", {articles: dbArticle});
    })
    .catch(function (err) {
      res.json(err);
    });
    
  });

  
router.get('/savedarticles', function (req, res) {
  console.log("enter savedarticles in html-router");
  db.Article.find({ saved: true })
  .then(function (dbArticle) {
      res.render("saved", {articles: dbArticle});
  })
  .catch(function (err) {
    res.json(err);
  });
  
});
module.exports = router;