const https = require('https');

var options = {
  hostname: 'apisandbox.moxtra.com',
  port: 443,
  path: '/oauth/token?client_secret=rdLIYJ0lydA&client_id=mD_t2cBz6d0&grant_type=http://www.moxtra.com/auth_uniqueid&uniqueid=andrew&timestamp=' + String((new Date()).getTime()),
  method: 'POST'
};

var globalAccessToken;

var req = https.request(options, function (res) {
  if (res.statusCode != 200) console.log("ERROR! CONNECTION BAD.");
  res.on('data', function (d) {
    globalAccessToken = JSON.parse(d).access_token;
    console.log(globalAccessToken);
  });
});
req.end();


module.exports = {
  init: function() {
  var options = {
        mode: "sandbox", //for production environment change to "production"
        client_id: "mD_t2cBz6d0",
        access_token: globalAccessToken, //valid access token from user authentication
        invalid_token: function(event) {
            alert("Access Token expired for session id: " + event.session_id);
        }
    };
    //Moxtra.init(options);
  }
}
