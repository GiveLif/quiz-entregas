var express = require('express');
var router = express.Router();
var path = require('path');

var quizController = require('../controllers/quiz_controller');
var commentController = require("../controllers/comment_controller");
var userController = require("../controllers/user_controller");
var sessionController = require("../controllers/session_controller");

/* GET author. */
router.use(express.static(path.join(__dirname, 'public')));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//router.get('/question', quizController.question);
//router.get('/check', quizController.check);

// Autoload de parámetros
router.param("quizId", quizController.load); //autoload :quizId
router.param("userId", userController.load); //autoload :userId
router.param("commentId", commentController.load); //autoload :commentId

// Rutas de sesión
router.get("/session", sessionController.new);
router.post("/session", sessionController.create);
router.delete("/session", sessionController.destroy);

// Definición de rutas de cuenta
router.get("/users", userController.index);
router.get("/users/:userId(\\d+)", userController.show);
router.get("/users/new", userController.new);
router.post("/users", userController.create);
router.get("/users/:userId(\\d+)/edit", sessionController.loginRequired, sessionController.adminOrMyselfRequired, userController.edit);
router.put("/users/:userId(\\d+)", sessionController.loginRequired, sessionController.adminOrMyselfRequired, userController.update);
router.delete("/users/:userId(\\d+)", sessionController.loginRequired, sessionController.adminAndNotMyselfRequired, userController.destroy);

// Definición de rutas de /quizzes
router.get("/quizzes.:format?", quizController.index);
router.get("/quizzes/:quizId(\\d+).:format?", quizController.show);
router.get("/quizzes/:quizId(\\d+)/check", quizController.check);
router.get("/quizzes/new", sessionController.loginRequired, quizController.new);
router.post("/quizzes", sessionController.loginRequired, quizController.create);
router.get("/quizzes/:quizId(\\d+)/edit", sessionController.loginRequired, quizController.ownershipRequired, quizController.edit);
router.put("/quizzes/:quizId(\\d+)", sessionController.loginRequired, quizController.ownershipRequired, quizController.update);
router.delete("/quizzes/:quizId(\\d+)", sessionController.loginRequired, quizController.ownershipRequired, quizController.destroy);

// Definición de rutas de comentarios
router.get("/quizzes/:quizId(\\d+)/comments/new", sessionController.loginRequired, commentController.new);
router.post("/quizzes/:quizId(\\d+)/comments", sessionController.loginRequired, commentController.create);
router.put("/quizzes/:quizId(\\d+)/comments/:commentId(\\d+)/accept", sessionController.loginRequired, quizController.ownershipRequired, commentController.accept);

module.exports = router;
