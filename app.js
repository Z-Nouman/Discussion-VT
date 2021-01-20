const express = require('express');
const app = express();
const path =require('path');

/*CORS stands for Cross Origin Resource Sharing and allows modern web browsers to be able to send AJAX requests and receive HTTP responses for resource from other domains other that the domain serving the client side application.*/
const cors = require('cors');

//Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const bodyParser = require('body-parser');

// JWT logic. Uses express-jwt which is a middleware that validates JsonWebTokens and sets req.user.
const jwt = require('./_helpers/jwt');


// The error handler
const errorHandler = require('./_helpers/error-handler');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
app.use('/', express.static(path.join(__dirname + '/HW5angular_starter/dist/HW5Angular')));
app.use(jwt());

app.use('/user', require('./routes/user.router'));
app.use('/course', require('./routes/course.router'));

app.use(errorHandler);
// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, function () {
  console.log('Server listening on port ' + port);
  console.log(path.join(__dirname + '/HW5angular_starter'));
});

