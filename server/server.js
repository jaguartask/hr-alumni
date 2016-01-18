var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var util = require('./config/utils.js');
var handler = require('./config/request-handler.js');
var msgBoardHandler = require('./config/messageBoardHandler');
var bodyParser  = require('body-parser');
var tracker = require('./config/tracker.js');
var request = require('request');
var env = process.env.NODE_ENV || 'dev';



  // Express 4 allows us to use multiple routers with their own configurations
  var questionsRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../client'));


  app.use('/api/profiles', questionsRouter); // use questions router for all questions request


  // inject our routers into their respective route files
  // require('./config/request-handler.js')(questionsRouter);


// github auth
var passport = require('passport');
var GithubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = '';
var GITHUB_CLIENT_SECRET = '';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// variables that depened on the environment
if (env === 'dev') {

  passport.use(new GithubStrategy({
    clientID: '0b692ace36fc620839ea',
    clientSecret: '4466109ad476a5273f9ff10998a2c6926aa7217b',
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {

    // accessToken will now be available on the res.user obj
    profile.authInfo = accessToken;
    console.log("ACCESS TOKEN", accessToken);
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

mongoose.connect("mongodb://localhost/hralumnimark2");

} else {

  passport.use(new GithubStrategy({
    clientID: '22590cfd0af2cf2c13e8',
    clientSecret: 'b84e52eb142c9a613677e11c76e1d0dc27cdfaa3',
    callbackURL: "https://hr-alumni.herokuapp.com/auth/github/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    profile.authInfo = accessToken;
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));

mongoose.connect('mongodb://alumni:alumni@ds047095.mongolab.com:47095/heroku_2v9zdb19');
}

app.use(express.static(__dirname + '/../client'));

app.use(session({
  secret: 'lambo',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
  passport.authenticate('github', {
    scope: ['user', 'user:email', 'admin:org']
  }),
  function(req, res) {
  //  console.log('req', req);
  // console.log('res!!!!!!!!!', res);
  });

app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),

  function(req, userResponse, accessToken) {
  
    var data= {
      body: req.user,
      fromGitHub: true,
      authInfo: req.user.authInfo
    }
   // var apiQuery = 'https://api.github.com/users/GMeyr/orgs?type=private?access_token=' + data.authInfo;

    var apiQuery = 'https://api.github.com/users/' + req.user.githubName + '/orgs/';

    var options = {
      url: apiQuery,
      headers: {
        'User-Agent': 'GMeyr',
        'Access_token': data.authInfo,
        'filter': 'all'

      }
    };

    request(options, function(err, githubResponse, body){
      console.log("status", githubResponse);
      if(err){ console.log("org info request error:", err)};
      if( !err ){
        var parsed = JSON.parse(body);
        var HRmember = false;
        // parsed.forEach(function(orgMember){
        //   console.log('orgMember.login', orgMember.login);
        //   console.log('data.body', data.body.username);
        // });
        // // parsed.forEach(function(orgMember){

        // //   if( orgMember.login === data.body.username ){
        // //     HRmember = true;
        // //   }
        // // });

        // if( HRmember ){
          handler.createProfile(data, userResponse);
        // } else {
        //   userResponse.redirect('/#/membership');
        // }
      }
    });
  });

app.get('/', function(req, res) {
  res.render('index');
});

//insert util.checkUser before the handler function to restrict
//page to logged-in users only (as in the example below)
//app.get('/api/profiles', util.checkUser, handler.findAll);
app.get('/api/profiles', handler.findAll);
app.post('/api/profiles', handler.createProfile);
app.get('/api/profile/:githubName', handler.findOne);app.post('/api/updateProfile', handler.updateProfile)
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

//message board routes
app.get('/api/posts', msgBoardHandler.getAllPosts);
app.post('/api/posts', msgBoardHandler.savePost);
app.param('post', msgBoardHandler.preloadPost); //preloading data, check msgBoardHandler
app.get('/api/posts/:post', msgBoardHandler.getPost);
app.put('/api/posts/:post/upvote', msgBoardHandler.upvotePost);
app.put('/api/posts/:post/downvote', msgBoardHandler.downvotePost);
app.post('/api/posts/:post/comments', msgBoardHandler.addComment);
app.param('comment', msgBoardHandler.preloadComment); //preloading data, check msgBoardHandler
app.put('/api/posts/:post/comments/:comment/upvote', msgBoardHandler.upvoteComment);
app.put('/api/posts/:post/comments/:comment/downvote', msgBoardHandler.downvoteComment);
app.get('/api/posts/:post', msgBoardHandler.getPostComments);
app.get('/api/profile/:githubName', handler.findOne);
app.post('/api/updateProfile', handler.updateProfile)
app.post('/api/tracker', tracker.saveJob);
app.get('/api/tracker', tracker.getJobs);
app.post('/api/tracker/remove', tracker.removeJob);
app.post('/api/tracker/update', tracker.updateJob);

app.listen(port, function() {
  console.log('Server started on port: ' + port);
});