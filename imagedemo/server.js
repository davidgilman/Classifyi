//get our essentials

var express  = require('express');
var app      = express();
var nunjucks = require('express-nunjucks');
var multer   = require('multer');
var http     = require('http');
var port     = process.env.PORT || 8080;

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })//i like nunjucks more

app.set('view engine', 'html');

nunjucks.setup({
    autoescape: true,
    watch: true
}, app);


require('./app/routes.js')(app, multer); 

app.listen(port);
console.log('We are live on port ' + port);
