'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Venue = new Schema ({
  localname: String,
  localID: String,
  users: []
});

module.exports = mongoose.model("Venue", Venue);