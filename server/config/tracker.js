var Job = require('../models/JobSchema');

exports.saveJob = function(req, res, next) {
  console.log(req.body);
  var newJob = new Job(req.body);

  newJob
    .save()
    .then(function(result) {
      res.json(result)
    })
    .then(null, function(err) {
      console.log(err);
    })
}

exports.getJobs = function(req, res, next) {
  Job
    .find({})
    .then(function response(result) {
          res.json(result);
        })
    .then(null, function(err) {
      console.log(err);
    })
}

