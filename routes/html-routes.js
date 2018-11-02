var express = require("express");
var router = require("./api-routes.js");

// home page
router.get("/", function(req, res) {
    res.render("clear");
});

// re-routes all mistyped addresses on the domain to "home"
router.get("*", function(req, res) {
    res.render("clear");
});

module.exports = router;
    