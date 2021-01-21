const config = require('../config.json');
const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

const uri = "mongodb+srv://zaid:<password>@discussionvtcluster.j7jsf.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(uri);

module.exports = {
    User: require('../models/user.model'),
    Course: require('../models/course.model'),
    Comment: require('../models/comment.model')
};
