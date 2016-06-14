var models = require("../models"); //index.js
var Sequelize = require("../node_modules/sequelize");

//GET question
//exports.question = function(req, res, next) {
//  models.Quiz.findOne().then(function(quiz) {
//	if (quiz) {var answer = req.query.answer || "";
//		res.render('quizzes/question', {question: quiz.question, answer: answer});
//	} 
//   else {throw new Error("No hay preguntas en la BBDD.");
//   }
//  }).catch(function(error) { next(error);});
//};

// ownership required
exports.ownershipRequired = function(req, res, next) {
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

//GET /quizzes
exports.index = function(req, res, next) {
	var texto_a_buscar = req.query.search;
	 if(texto_a_buscar){
	  for (var i = 0; i<texto_a_buscar.length; i++){
	   if (texto_a_buscar[i] === "+" ) { texto_a_buscar = texto_a_buscar.substring(0, i) + "%" + texto_a_buscar.substring(i+1, texto_a_buscar.length+1);}
	   }
	  texto_a_buscar = "%"+texto_a_buscar+"%";
	  models.Quiz.findAll({where: {question: {$like: texto_a_buscar}}}).then(function(quizzes){
	   res.render("quizzes/search.ejs", { quizzes : quizzes});}).catch(function(error){next(error);});
	  } else {
	models.Quiz.findAll().then(function(quizzes){ 
		res.render("quizzes/index.ejs", { quizzes : quizzes});
	})
	.catch(function(error){next(error);});
}};
//GET /quizzes/new
exports.new = function(req, res, next){
 var quiz = models.Quiz.build({question: "", answer: ""});
 res.render("quizzes/new", {quiz: quiz});
};
  

//DELETE /quizzes/:id
exports.destroy = function(req, res, next) {
 req.quiz.destroy().then( function() {
  req.flash("success", "Quiz borrado con éxito.");
  res.redirect("/quizzes");
 })
 .catch(function(error) {
  req.flash("error", "Error al editar el Quiz: "+error.message);
  next(error); 
 });
};
 

//POST /quizzes/create
exports.create = function(req, res, next){
 var authorId = req.session.user && req.session.user.id || 0;

 var quiz = models.Quiz.build({ question: req.body.quiz.question, answer: req.body.quiz.answer, AuthorId: authorId});
 
 quiz.save({fields: ["question", "answer", "AuthorId"]}).then(function(quiz){
  req.flash("success", "Quiz creado con éxito.");
  res.redirect("/quizzes");
 })
 .catch(Sequelize.ValidationError, function(error){
   req.flash("error", "Errores en el formulario:");
   for (var i in error.errors) {
    req.flash("error", error.errors[i].value);};
   res.render("quizzes/new", {quiz: quiz});
 })
 .catch(function(error) {
  req.flash("error", "Error al crear un Quiz: "+error.message);
  next(error); 
 });
};

//Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, quizId) {
 models.Quiz.findById(quizId, {include: [models.Comment]}).then(function(quiz){
  if (quiz) {
   req.quiz = quiz;
   next();}
  else {
    throw new Error("No existe quizId=" + quizId);
  }
 }).catch(function(error) { next(error); });
};

//GET /quizzes/:id

exports.show = function(req, res, next) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
   if (quiz) {
    var id = req.params.quizId;
    var question = req.quiz.question;
    var answer = req.query.answer || '';
    res.render('quizzes/show', {quiz: req.quiz, answer: answer, id: id});
   } 
   else {
    throw new Error("No existe este quiz en la BD.");
   }
  }).catch(function(error) { next(error); });
};

//PUT /quizzes/:id
exports.update = function(req, res, next) {
 
 req.quiz.question = req.body.quiz.question;
 req.quiz.answer = req.body.quiz.answer;

 req.quiz.save({fields: ["question", "answer"]}).then(function(quiz) {
  req.flash("success", "Quiz editado con éxito.");
   res.redirect("/quizzes");})
  .catch(Sequelize.ValidationError, function(error){
   req.flash("error", "Errores en el formulario:");
   for (var i in error.errors) {
    req.flash("error", error.errors[i].value);
  };
  res.render("quizzes/edit", {quiz: req.quiz});
  }).catch(function(error){
   req.flash("error", "Error al editar el Quiz: " + error.message);
    next(error);
  });
};

//GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
  var quiz = req.quiz;
  res.render("quizzes/edit", {quiz: quiz});
};

//GET /quizzes/:id/check

exports.check = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
   if (quiz) {
    var answer = req.query.answer || '';
    var result = answer === req.quiz.answer ? 'Correcta' : 'Incorrecta';
    res.render('quizzes/result', {quiz: req.quiz, result:result, answer: answer});
   } 
   else {
    throw new Error("No existe este quiz en la BD.");
   }
  }).catch(function(error) { next(error); });
};

//GET /check
//exports.check = function(req, res, next) {
//  models.Quiz.findOne() // Busca la primera pregunta
//  .then(function(quiz) {
//   if (quiz) {
//    var answer = req.query.answer || '';
//    var result = answer === quiz.answer ? 'Correcta' : 'Incorrecta';
//    res.render('quizzes/result', {result: result, answer: answer});
//   } 
//   else {
//    throw new Error("No hay preguntas en la BBDD.");
//   }
//  }).catch(function(error) { next(error); });
//};
