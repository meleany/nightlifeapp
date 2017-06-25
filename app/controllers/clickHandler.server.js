'use strict';

var Venue = require("../models/venues.js");

function clickHandler () {
    
  this.getList = function (req, res) {
    req = req.businesses;
    var listNames = [];
    var listIds = [];
    var listgoing = [];
    for(var i=0; i<req.length; i++) {
      listNames.push(req[i].name);
      listIds.push(req[i].id);
      listgoing.push(0);
    }
    Venue
      .find({localname: {$in: listNames}})
      .exec( function (err, results) {
        if (err) { throw err; }
        var index;
        for(var i=0; i<results.length; i++) {
          index = listNames.indexOf(results[i].localname);
          if(listIds[index] == results[i].localID) {
            listgoing[index] = results[i].users.length;
          }
        }
        res.send({businesses: req, going: listgoing});
       });
  };
  
  this.userUpdate = function (req, res) {
    Venue
      .findOne({localname: req.local, localID: req.localID})
      .exec(function (err, results) {
        if (err) { throw err; }
        if(results) {
          if(results.users.indexOf(req.user) == -1){
            Venue
              .findOneAndUpdate({localname: req.local, localID: req.localID}, {$push: {users: req.user}}, {safe: true, upsert: true, new : true})
              .exec(function (err, results) {
                if(err) { throw err; }
                res.send({going: results.users.length});
              })
          }else{
            Venue
              .findOneAndUpdate({localname: req.local, localID: req.localID}, {$pull: {users: req.user}}, {safe: true, upsert: true, new : true})
              .exec(function (err, results) {
                if(err) { throw err; }
                res.send({going: results.users.length});
              })            
          }
        }else{
          var newVenue = new Venue();
          newVenue.localname = req.local;
          newVenue.localID = req.localID;
          newVenue.users.push(req.user);
          newVenue.save(function (err) {
            if(err) { throw err; }
            res.send({going: 1});
          });          
        }
      });
  };
  
}

module.exports = clickHandler;