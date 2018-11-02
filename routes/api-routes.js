var express = require("express");
var cheerio = require("cheerio");
var db = require("../models");
var request = require("request");

var router = express.Router();
var scrapedData = [];
var savedData = [];

router.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/section/todayspaper", function(error, response, html) {
        var $ = cheerio.load(html);
        $(".story-body").each(function(i, element) {

            var result = {};

            result.title = $(this)
                .children("h2")
                .children("a")
                .text();
            result.link = $(this)
                .children("h2")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("p.summary")
                .text();

            duplicateValidation(result, req, res);
        });
        findArticles(req, res);
    });
});

function findArticles(req, res) {
    db.Article.find({ saved: false })
        .then(function (allArticles) {
            scrapedData = allArticles;
            res.status(200).end();
        })
        .catch(function(err) {
            res.json(err);
        });
}

function duplicateValidation(result, req, res) {
    var result=result;
    db.Article.findOne({ title: result.title })
        .then(function(dbValidation) {
            if (dbValidation == null) {
                addArticle(result, req, res);
            } else {
                console.log("This is a duplicate request");
            };
        });
}

function addArticle(result, req, res) {
    db.Article.create(result)
        .then(function(dbArticle) {
            console.log("created!");
        })
        .catch(function(err) {
            return err;
        });
};

router.get("/saved", function(req, res) {
    db.Article.find({ saved: true })
        .then(function (savedArticles) {
            savedData = savedArticles;
            res.render("saved", { savedItems: savedData });
        }).catch(function (err) {
            res.json(err);
        });
});

router.get("/updated-scraped-results", function(req, res) {
    db.Article.find({ saved: false })
        .then(function (refreshedArticles) {
            scrapedData = refreshedArticles;
            res.render("index", { scrapedItems: scrapedData });
        }).catch(function (err) {
            res.json(err);
        });
});

router.get("/scraped-results", function(req, res) {
    res.render("index", { scrapedItems: scrapedData });
});

router.put("/save-article", function(req, res) {
    db.Article.updateOne({ _id: req.body.id }, { $set: { saved: true } })
        .then(function (result) {
            res.status(200).end();
        }).catch(function (err) {
            res.json(err);
        });
});

router.get("/clear", function(req, res) {
    scrapedData = [];
    res.render("clear");
});

router.delete("/delete-article", function(req, res) {
    db.Article.deleteOne({ _id: req.body.id })
        .then(function (result) {
            res.status(200).end();
        }).catch(function (err) {
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
            res.json(err);
        });
});

router.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

module.exports = router;
