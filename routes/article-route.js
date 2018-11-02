var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapenews";
//mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

router.get("/api/scrape", function (req, res) {
  var results = [];
  request("http://www.echojs.com/", function (error, response, html) {
    var $ = cheerio.load(html);
    $("article h2").each(function (i, element) {
      var article = {};
      article.title = $(this).children("a").text();
      article.link = $(this).children("a").attr("href");
      article.summary = $(this).children("a").text();

      db.Article.findOne({ title: article.title.trim() }).then(function (dbFinder) {
        if (dbFinder) {
          return;
        }
        else {
          console.log("add article");
          db.Article.create(article)
            .then(function (dbArticle) {
            })
            .catch(function (err) {
              // If an error occurred, send it to the client
              console.log(err);
            });
        }

      });
    });
    console.log("scrape comepleted");
    res.redirect("/");

  });
});

router.post("/api/articles", function (req, res) {
  db.Article.find({ saved: req.body.saved })
    .then(function (dbArticle) {
      res.render("index", { articles: dbArticle });
    })
    .catch(function (err) {
      res.redirect(err);
    });
});

router.get("/api/articles/notSaved", function (req, res) {
   db.Article.find({ saved: false })
    .then(function (dbArticle) {
      res.render("index", { articles: dbArticle });
    })
    .catch(function (err) {
      res.json(err);
    });
});


router.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {

      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


router.post('/api/deleteArticle', (req,res)=>{
  db.Article.findOneAndUpdate({ link: req.body.link }, { $set: { "saved": req.body.saved } })
    .then(function (dbArticle) {
      res.redirect("/savedarticles");
    })
    .catch(function (err) {
      res.json(err);
    });
});


router.post("/api/savearticle", function (req, res) {
  db.Article.findOneAndUpdate({ link: req.body.link }, { $set: { "saved": req.body.saved } })
    .then(function (dbArticle) {
      res.redirect("/");
    })
    .catch(function (err) {
      res.json(err);
    });
});


router.get("/api/clear/notSaved", function (req, res) {
  console.log("enter clear all");
  db.Article.remove({ saved: false })
    .then(function (dbArticle) {
      res.redirect('/');
    })
});

router.get("/api/clear/saved", function (req, res) {
  console.log("enter clear saved");
  db.Article.updateMany({ saved: true }, { $set: { "saved": false } })
    .then(function (dbArticle) {
       res.redirect('/');
    })
});

module.exports = router;