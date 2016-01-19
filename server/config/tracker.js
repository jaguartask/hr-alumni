var Job = require('../models/JobSchema');

exports.saveJob = function(req, res, next) {
  console.log(req.body);
  var newJob = new Job(req.body);

  newJob
    .save()
    .then(function(result) {
      return res.json(result)
    })
    .then(null, function(err) {
      console.log(err);
    })
};

exports.getUserJobs = function(req, res, next) {
  console.log('getUser', req.user);
  Job
    .find({user: req.user})
    .then(function response(result) {
      console.log(result);
          return res.json(result);
        })
    .then(null, function(err) {
      console.log(err);
    })
}

exports.getJobs = function(req, res, next) {
  Job
    .find({userID: req.body.user})
    .then(function response(result) {
          return res.json(result);
        })
    .then(null, function(err) {
      console.log(err);
    })
};

exports.removeJob = function(req, res, next) {
  var id = req.body._id;
  Job
    .findByIdAndRemove(id)
    .exec()
    .then(function(result) {
      return res.json(result)
    })
    .then(null, function(err) {
      console.log(err);
    })

}

exports.updateJob = function(req, res, next) {
  var id = req.body._id;
  Job
    .findByIdAndUpdate(id, req.body)
    .exec()
    .then(function(result) {
     res.json(result);
    })
    .then(null, function(err) {
      console.log(err);
    })
}

