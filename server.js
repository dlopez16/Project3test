require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var http	= require('http');


//mongoose connection setup

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mongolab-defined-73042';
//end of mongoose setup

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit:'50mb'}));
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use(express.static('public'));
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

var port = http.createServer(app);
// start server
var server = app.listen(process.env.PORT || 3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});