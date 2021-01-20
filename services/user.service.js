const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/database');
const User = db.User;
const Course = db.Course;

module.exports = {
    authenticate,
    getAllUsers,
    getById,
    addUser,
    registerCourse,
    joinCourse
}

// Authenticate the user using the JWT
async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

// Gets a list of all users
async function getAllUsers() {
    return await User.find().select('-hash');
}

// Returns a user's info given an ID
async function getById(id) {
    return User.findOne({"_id":id});
}

// Enrolls a student to a course
async function registerCourse(req){
    let username = req.user.sub;
    let student = await User.findOne({"_id": username});
    //Check if the user is a student
    if (student.role.toString() === "Guest"){
        throw "Guests cannot register for classes";
    }
    let studentCourses = student.courses;
    studentCourses.push(req.body._id);
    await User.updateOne({"_id": username}, {$push: {"courses": req.body._id}});
}

// Add a new user
async function addUser(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    else  if (await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();

}

// Allows a user to join a course
async function joinCourse(req){
    let username = req.user.sub;
    let student = await User.findOne({"_id": username});
    let course = await Course.findOne({"accessCode": req.body.accessCode.toString()});
    //Check if the user is a student
    let allCourses = await Course.find({});
    let shouldAdd = false;
    allCourses.forEach(course => {
        if (course.accessCode.toString().localeCompare(req.body.accessCode.toString()) == 0){
            shouldAdd = true;
        }
    })
    if (shouldAdd){
        let studentCourses = student.courses;
        studentCourses.push(course._id);
        await User.updateOne({"_id": username}, {$push: {"courses": course._id}});
    }
    else{
        throw 'Incorrect access code';
    }
}
