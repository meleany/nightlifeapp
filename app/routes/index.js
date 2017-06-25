'use strict';

var path = process.cwd();
var ClickHandler = require(path + "/app/controllers/clickHandler.server.js");

module.exports = function (app, passport, yelp) {
  
  var clickHandler = new ClickHandler();
  
  function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/");
    }
  }
  
  app.route("/")
    .get(function (req, res) {
      res.sendFile( path + "/public/main.html");
    });
  
  app.route("/logout")
    .get(function (req, res) {
      req.logout();
      res.redirect("/");
    }); 
  
  app.route("/auth/github")
    .get(passport.authenticate("github"));
  
  app.route("/auth/github/callback")
    .get(passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/"
    }));
  
  app.route("/api/login")
	  .get(function (req, res) {
      if(req.isAuthenticated()) {
        res.send({logged: true, userid: req.user.github});        
      } else {
        res.send({logged: false});     
      }
	  });
  
  app.route("/api/yelp/:place")
    .get(function (req, res) {
      yelp.search("term=Bars,restaurants&location=" + req.params.place)
      .then(function (result) {
        clickHandler.getList(result, res);
      })
    });
  
  app.route("/api/update")
    .post(function (req, res) {
      clickHandler.userUpdate(req.body, res);
    });
};