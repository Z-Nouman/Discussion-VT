const userService = require('../services/user.service')

module.exports = {
    authenticate,
    getAllUsers,
    register,
    registerCourse,
    joinCourse,
    getUser
};

// Returns the user's info given their ID
function getUser(req, res, next){
    userService.getById(req.params.id).then(data => {
        res.json(data);
    }).catch(err => next(err));
}

// Authenticates the user
function authenticate(req, res, next) {
       userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

// Allows a user to enroll in a course
function joinCourse(req, res, next){
    userService.joinCourse(req)
        .then(data => res.json(data))
        .catch(err => next(err));
}

// Returns a list of all users
function getAllUsers(req, res, next) {
    //  console.log("getAll", req.body);
    userService.getAllUsers()
        .then(users => res.json(users))
        .catch(err => next(err));
}

// Registers a new user
function register(req, res, next) {
    console.log("WE'RE TELLING THE DATABASE TO SAVE A USER");
   userService.addUser(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

// Allows a user to register to a course (used in the case of professors)
function registerCourse(req, res, next) {
    // Handle student requests to register courses.
    userService.registerCourse(req)
        .then((data) => res.json(data))
        .catch(err => next(err));
}
