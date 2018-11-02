var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var request = require("request");
// var cheerio = require("cheerio");
var db = require("../models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapenews";
//mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


router.get('/api/notes/:id', (req,res) =>{
    console.log("enter 'api'getnotes");
    db.Article
      .findOne({_id: req.params.id})
      .populate('notes')
      .then(results => res.json(results))
      .catch(err => res.json(err));
  });
  
  router.post('/api/createNote',  (req,res)=>{
    let {body, articleId } = req.body;
    let note = {
      body
    };
    db.Note
      .create(note)
      .then( result => {
        db.Article
          .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})
          .then( data=> res.json(result))
          .catch( err=> res.json(err));
      })
      .catch(err=> res.json(err));
  });
  
  //post route to delete a note
  router.post('/api/deleteNote', (req,res)=>{
    let {articleId, noteId} = req.body;
    console.log("articleId: "+articleId);
    console.log("noteId: "+noteId);
    db.Note
      .remove({_id: noteId})
      .then(result=> res.json(result))
      .catch(err=> res.json(err));
  });
  
  module.exports = router;