// Require epxress and create express app
var express = require("express");
var app = express();

// Static content
app.use(express.static(__dirname + "/static"));

// Show home page
app.get("/", function(req, res) {
    res.render("index");
});

// Listen on port 8000
app.listen(8000, function() {
    console.log("Node.js is running on port 8000");
});