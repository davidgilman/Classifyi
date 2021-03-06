// app/routes.js
var request = require("request");
var fs = require('fs');

module.exports = function(app, passport, multer) {
    app.get('/', function(req, res) {
        res.render('index'); // load the index file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        const https = require('https');

        var options = {
          hostname: 'apisandbox.moxtra.com',
          port: 443,
          path: '/oauth/token?client_secret=rdLIYJ0lydA&client_id=mD_t2cBz6d0&grant_type=http://www.moxtra.com/auth_uniqueid&uniqueid=' + req.user._id + '&timestamp=' + String((new Date()).getTime()),
          method: 'POST'
        };
        
    var globalAccessToken;

    var req2 = https.request(options, function (res2) {
      if (res.statusCode != 200) console.log("ERROR! CONNECTION BAD.");
      res2.on('data', function (d) {
        globalAccessToken = JSON.parse(d).access_token;
        console.log(globalAccessToken);
        res.render('profile', {
            user : req.user, // get the user out of session and pass to template
            token: globalAccessToken
        });
      });
    });
    req2.end();


    });
    app.post('/profile', multer().single('upl'), function(req,res){
        	console.log(req.body); //form fields
        	/* example output:
        	{ title: 'abc' }
        	 */
        	console.log(req.file); //form files
            //console.log(req.file.buffer);
             request({
                 uri: 'https://api.projectoxford.ai/vision/v1.0/analyze',
                 method: 'POST',
                 headers: {
                     "Content-Type": "multipart/form-data",
                     "Ocp-Apim-Subscription-Key": "0a6513c2c26145f0823468de20d9d4e1"
                 },
                 formData: { my_file: req.file.buffer }   
             }, function(error, response, body){
                 if(error) {
                     console.log(error);
                 } else {
                     console.log(response.statusCode, body);
                     if (JSON.parse(body).categories && JSON.parse(body).categories[0].name.indexOf("animal_") > -1) { console.log("This is an animal");
                         res.send('This is an animal.');
                     } 
                 }
             });
                     request({
                 uri: 'https://api.projectoxford.ai/vision/v1.0/ocr',
                 method: 'POST',
                 headers: {
                     "Content-Type": "multipart/form-data",
                     "Ocp-Apim-Subscription-Key": "0a6513c2c26145f0823468de20d9d4e1"
                 },
                 formData: { my_file: req.file.buffer }   
             }, function(error, response, body){
                 if(error) {
                     console.log(error);
                 } else {
                 
                 if(body.indexOf("Confidential") > -1) {
                     console.log("Is Confidential");
                     res.send('This is confidential.');
                 }
                 }
             });
    
        });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
