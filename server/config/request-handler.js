var User = require('../users/userModel.js');


exports.createProfile = function(req, res) {
  //console.log('request looks liek : ', req)
  //console.log('request.fromgithub : ', req.fromGitHub);
  // console.log("!!======!!");
  // console.log("req.user.authInfo (in handler):", req.body['json'].authInfo);
  if(req.fromGitHub) {
    var name = req.body['_json'].name;
    var profilePic= req.body['_json']['avatar_url'];
    var githubName = req.body.username;
    var email = req.body['_json'].email;
    var location = req.body['_json'].location;
    var summary = '';
    var status = req.body['_json'].hireable || '';
    var companies = '';
    var languages ='';
    var blog = req.body['_json'].blog || '';
    var website = '';
    var linkedin = '';
    var github = req.body['_json'].html_url;
    var project1  = '';
    var project2  = '';
    var project3  = '';
  }
   // else {
  //   var firstName = req.body.firstName;
  //   var lastName = req.body.lastName;
  //   var githubName = req.body.github;
  //   var email = req.body.email;
  //   var location = req.body.location;
  //   var summary = req.body.summary;
  //   var status = req.body.status;
  //   var companies = req.body.companies;
  //   var languages = req.body.languages;
  //   var blog = req.body.blog;
  //   var website = req.body.website;
  //   var linkedin = req.body.linkedin;
  //   var github = req.body.github;
  //   var project1  = req.body.project1;
  //   var project2  = req.body.project2;
  //   var project3  = req.body.project3;
  // }

  console.log('github name', githubName);
  var query= User.findOne({
      'contact.githubName':  githubName

    });

  query.exec(function(err, user) {
      console.log('user: ', user);
      console.log('err', err);
      if (!user) {
        var newUser = new User({
          contact: {
            name: name,
            profilePic: profilePic,
            githubName: githubName,
            email: email,
            location: location
          },
          about: {
            job: job,
            summary: summary,
            status: status
          },
          experience: {
            companies: companies,
            languages: languages
          },
          links: {
            blog: blog,
            website: website,
            linkedin: linkedin,
            github: github
          },
          projects: {
            project1: project1,
            project2: project2,
            project3: project3

          }
        });
        console.log('new user on line 64: ', newUser);
        newUser.save(function(err, newUser) {
          if (err) {
            console.log('there was an error with saving');
            res.status(500).send(err);
          }
          console.log('new user gets saved: ', newUser);
          console.log('new user github name:', newUser.contact.githubName)
          // res.json(newUser);
          res.redirect('/#/updateProfile/'+ newUser.contact.githubName)

        });
      } else {
        console.log("Profile already exists");
        console.log('user exists: ', user.contact.githubName);
        // res.redirect('/#/profiles');
        res.redirect('/#/updateProfile/'+ user.contact.githubName)
      }
    });
};


exports.findAll = function(req, res) {
  User.find({}).exec(function(err, profiles) {
    //console.log('profiles in find all', profiles);
    res.json(profiles);
  });
};

exports.findOne = function(req, res) {
  console.log('gets to servers findOne: ', req.params.githubName);
  User.find({'contact.githubName':  req.params.githubName
  }).exec(function(err, profile) {
    res.json(profile);
  });
};

exports.updateProfile= function (req, res) {
   console.log('req.body', req.body);
    var name = req.body[0].contact.name;
    var profilePic = req.body[0].contact.profilePic;
    var githubName = req.body[0].contact.githubName;
    var email = req.body[0].contact.email;
    var job = req.body[0].about.job;
    var location = req.body[0].contact.location;
    var summary = req.body[0].about.summary;
    var status = req.body[0].about.status;
    var companies = req.body[0].experience.companies;
    var languages = req.body[0].experience.languages;
    var blog = req.body[0].links.blog;
    var website = req.body[0].links.website;
    var linkedin = req.body[0].links.linkedin;
    var github = req.body[0].links.github;
    var project1  = req.body[0].project1;
    var project2  = req.body[0].project2;
    var project3  = req.body[0].project3;


  User.findOneAndUpdate( {'contact.githubName': githubName },
     {
         contact: {
          name: name,
          profilePic: profilePic,
          githubName: githubName,
          email: email,
          location: location
          },
          about: {
            job:job,
            summary: summary,
            status: status
          },
          experience: {
            companies: companies,
            languages: languages
          },
          links: {
            blog: blog,
            website: website,
            linkedin: linkedin,
            github: github
          },
          projects: {
            project1: project1,
            project2: project2,
            project3: project3

          }
        }, {new:false},
        function (err, person) {
          if(err) {console.log(err) }
        })
}
