var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var db = require("./models");
var PORT = process.env.PORT || 5000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var router = require("./routes/html-routes");
app.use(router);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});