var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var util = require('./config/utils.js');
var handler = require('./config/request-handler.js');
var bodyParser  = require('body-parser');


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

var GITHUB_CLIENT_ID = '22590cfd0af2cf2c13e8';
var GITHUB_CLIENT_SECRET = 'b84e52eb142c9a613677e11c76e1d0dc27cdfaa3';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GithubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));


// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect("mongodb://localhost/hralumnimark2");

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
    scope: ['user', 'user:email', 'read:org']
  }),
  function(req, res) {
    console.log('req', req);
    console.log('res', res);
  });

app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // console.log('req',req.user);
    var data= {
      body: req.user,
      fromGitHub: true
    }
    console.log('data here: ', data);
    handler.createProfile(data, res)
    // res.redirect('/');
  });

app.get('/', function(req, res) {
  res.render('index');
});
//app.get('api/profiles', loginPost);  //this doesn't invoke the function
app.get('/api/profiles', util.checkUser, handler.findAll); //this has a CORS error if you try to call loginPost
app.post('/api/profiles', handler.createProfile);
app.get('/api/profile/:githubName', handler.findOne);
app.post('/api/updateProfile', handler.updateProfile)

app.listen(port, function() {
  console.log('Server started on port: ' + port);
});

function loginPost(req, res, next){
  console.log("calling loginPost");
  passport.authenticate('github', function(err, user, info){
    if(err){
      console.log("authenication error")
      return next(err);
    }
    if(!user){
      console.log("not logged in");
      req.session.messages = info.message;
      return res.redirect('/login');
    }
    req.logIn(user, function(err){
      if(err){
        req.session.messages = "Error logging in user";
        return next(err);
      }
      req.session.messages = "successful login";
      return res.redirect('/');
    });
  })(req, res, next);
}
