/**For HTTP methods**/
var express = require('express');
/**For dependancy injection. Instead of importing the models in the APIs, we inject wagner**/
var wagner = require('wagner-core');
/**To create paths**/
var path = require('path');
/**To generate a JSON web token**/
var jwt = require('jwt-simple');
/**To make HTTP calls, to facebook for instance**/
var request = require('request');
/**To extract data from the body of a request more easily**/
var bodyParser = require('body-parser');
/**For logging request details. Request are listed in the terminal when developping**/
var logger = require('morgan');
/**To enable cross-origin HTTP request, i.e. a client request sent from a different server**/
var cors = require('cors');
/**Interface to mongodb making it easier to query, validate and more**/
var mongoose = require('mongoose');
/**For expiration datetime of the JSON web token**/
var moment = require('moment');

var config = require('./config');
models = require('./models/models')(wagner);

var User = models.User;

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(config.FAAS_API_URL+'/'+config.FAAS_API_VERSION, require('./api')(wagner));
app.use('/papi/v1', require('./produces-api')(wagner));
app.use('/beer/v1', require('./beer-api')(wagner));
app.use('/iapi/v1', require('./image-api')(wagner));
app.use('/lib', express.static(path.join(__dirname, '../client/lib')));
app.use('/bin', express.static(path.join(__dirname, '../client/bin')));
app.use('/templates', express.static(path.join(__dirname, '../client/templates')));
app.use('/images', express.static(path.join(__dirname, '../client/images')));
app.use('/css', express.static(path.join(__dirname, '../client/css')));
app.use(express.static(path.join(__dirname, '../client/manifest')));
app.use('/angular', express.static(path.join(__dirname, '../node_modules/angular')));
app.use('/angular-animate', express.static(path.join(__dirname, '../node_modules/angular-animate')));
app.use('/angular-material', express.static(path.join(__dirname, '../node_modules/angular-material')));
app.use('/angular-aria', express.static(path.join(__dirname, '../node_modules/angular-aria')));
app.use('/satellizer', express.static(path.join(__dirname, '../node_modules/satellizer')));
app.use('/ng-file-upload', express.static(path.join(__dirname, '../node_modules/ng-file-upload/dist')));
app.use('/ng-html5dragdrop', express.static(path.join(__dirname, '../node_modules/ng-html5dragdrop/dist')));
app.use('/angular-ui-router', express.static(path.join(__dirname, '../node_modules/angular-ui-router/release')));

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email and/or password' });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email and/or password' });
      }
      res.send({ token: createJWT(user) });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
      displayName: req.body.displayName,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err, result) {
      if (err) {
      	console.log(err.toString());
        res.status(500).send({ message: err.toString() });
      }
      console.log(result);
      res.send({ token: createJWT(result) });
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */
app.post('/auth/facebook', function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }
	console.log(accessToken);
    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.header('Authorization')) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            
            user.facebook = profile.id;
            user.email = profile.email;
            user.token = accessToken.access_token;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
          	
          	existingUser.token = accessToken.access_token;
          	console.log(existingUser);
          	existingUser.save();
            var token = createJWT(existingUser);
            console.log(existingUser);
            return res.send({ token: token , facebook: accessToken.access_token}); 
          }
          var user = new User();
          //user._id = 'facebook' + '.' + profile.id;
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.email = profile.email;
          user.token = accessToken.access_token;
          console.log(user);
          user.save(function(error) {
	        if (error) {
	        	console.log(error.toString());
	        	return res.status(400).send({ message: 'Cannot save user' });
		    }
            var token = createJWT(user);
            console.log('saving user');
            res.send({ token: token });
          });
        });
      }
    });
  });
});

app.get(["/*"], function (req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.listen(3000);
console.log('Listening on port 3000!');
