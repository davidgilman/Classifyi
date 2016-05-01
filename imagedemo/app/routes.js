// app/routes.js
var request = require("request");
var fs = require('fs');

module.exports = function(app, multer) {
    app.get('/', function(req, res) {
        res.render('index'); // load the index file
    });

    app.post('/', multer().single('upl'), function(req,res){
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

}
