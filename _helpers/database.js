const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
//    "connectionString": "mongodb://localhost/CS4004",
module.exports = {
    User: require('../models/user.model'),
    Course: require('../models/course.model'),
    Comment: require('../models/comment.model')
};
