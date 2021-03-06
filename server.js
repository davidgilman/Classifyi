//get our essentials

var express  = require('express');
var app      = express();
var nunjucks = require('express-nunjucks');

var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var multer   = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

//get the db going on
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

//i like nunjucks more
app.set('view engine', 'html');

nunjucks.setup({
    autoescape: true,
    watch: true
}, app);

app.use(session({ secret: 'a_hedgehog_hackers_production_harinezumi_ga_imashita' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport, multer); 

app.listen(port);
console.log('We are live on port ' + port);
