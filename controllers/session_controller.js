var models = require("../models"); //index.js
var Sequelize = require("../node_modules/sequelize");
var url = require("url");



var authenticate = function(login, password) {
 return models.User.findOne({where: {username: login}}).then(function(user) {
  if (user && user.verifyPassword(password)) {
   return user;
  } else {
   return null;
  }
 });
};

// GET session
exports.new = function(req, res, next) {
 var redir = req.query.redir || url.parse(req.headers.referer || "/").pathname;
 if (redir === "/session" || redir ==="/users/new") { redir = "/";}
 res.render("session/new", {redir: redir});
};


//POST session
exports.create =function(req, res, next) {
 var redir =req.body.redir || "/";
 
 var login =req.body.login;
 var password = String(req.body.password);
 
 authenticate(login, password).then(function(user) { if (user) {
  req.session.user = {id:user.id, username:user.username, isAdmin:user.isAdmin};
  
  res.redirect(redir);
 } else {
  req.flash("error", "La autenticación ha fallado.");
  res.redirect("/session?redir="+redir);
 }
}).catch(function(error) {
  req.flash("error", "Se ha producido un error: ");
  next(error);
 });
};

// DELETE session
exports.destroy = function(req, res, next) {
 delete req.session.user;
 res.redirect("/session");
};

// login required
exports.loginRequired = function(req, res, next) {
 if(req.session.user) {
	next();
 } else {
	res.redirect("/session?redir=" + (req.param("redir") || req.url));}
};

// Admin and not myself
exports.adminAndNotMyselfRequired = function(req, res, next){
var isAdmin = req.session.user.isAdmin;
 var quizAuthorId = req.session.AuthorId;
 var loggedUserId = req.session.user.id;

  if (isAdmin && quizAuthorId !== loggedUserId) {
   next();
  } else {
   console.log("Operación prohibida: El usuario logead no es el autor del quiz, ni un administrador.");
   res.send(403);
  }
};

// Admin or myself
exports.adminOrMyselfRequired = function(req, res, next){
 var isAdmin = req.session.user.isAdmin;
 var quizAuthorId = req.session.AuthorId;
 var loggedUserId = req.session.user.id;

  if (isAdmin || quizAuthorId === loggedUserId) {
   next();
  } else {
   console.log("Operación prohibida: El usuario logead no es el autor del quiz, ni un administrador.");
   res.send(403);
  }
};
