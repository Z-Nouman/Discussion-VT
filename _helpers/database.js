const config = require('../config.json');
const mongoose = require('mongoose');
try{
    mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });

} catch (e){
    console.log("THERE IS A FUCKING ERROR YOU DIPSHIT" + e)
}
//
// const uri = "mongodb+srv://zaid:alnouman99@discussionvtcluster.j7jsf.mongodb.net/discussionvtcluster?retryWrites=true&w=majority";
// mongoose.connect(uri, { useCreateIndex: true, useNewUrlParser: true });

module.exports = {
    User: require('../models/user.model'),
    Course: require('../models/course.model'),
    Comment: require('../models/comment.model')
};
