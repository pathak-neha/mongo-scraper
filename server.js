var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");

var PORT = process.env.PORT || 3000;

var app = express();
// Configure middleware
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Routes
var routes = require("./routes/html-routes");
var articleroutes = require("./routes/article-route");
var noteroutes = require("./routes/note-routes");
app.use(routes);

app.use(articleroutes);
app.use(noteroutes);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});