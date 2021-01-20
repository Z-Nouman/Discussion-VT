const courseService = require('../services/course.service')
const userService = require('../services/user.service')
const fs = require('fs');
const userFiles = './user_upload/';
const path = require('path');

module.exports = {
    createCourse,
    getCourses,
    deleteCourse,
    getEnrolledStudents,
    updateAccessCode,
    getAccessCode,
    updateVisibility,
    postComment,
    newPost,
    upload,
    getFile,
    retrievePosts,
    getComments,
    editComment,
    deleteComment,
    deletePost,
    removeUser,
    getFile
};

// Removes an enrolled user from a course given the user ID and course ID
function removeUser(req, res, next){
    courseService.removeUser(req.body.userID, req.body.courseID).then(x => {
        res.json(x);
    })
}

// Deletes a post given a course ID
function deletePost(req, res, next){
    courseService.deletePost(req.params.id).then(x => {
        res.json(x);
    })
}

// Edits an existing comment
function editComment(req, res, next){
    courseService.editComment(req.body.data, req.body.postID, req.body.newComment, req).then(x => {
        res.json(x);
    })
}

// Deletes a comment
function deleteComment(req, res, next){
    courseService.deleteComment(req.body.content, req.body.post, req).then(x => {
        res.json(x);
    })
}

// Returns the comments of a post
function getComments(req, res, next){
    courseService.getComments(req.params.id, req.user.sub).then(x => {
        res.json(x);
    });

}

// Creates a new course
function createCourse(req, res, next) {
    courseService.addCourse(req)
        .then((message) => {
            let newReq = {
                user: {sub: req.user.sub},
                body: message
            }
            userService.registerCourse(newReq).then(x => console.log(x));
            res.json(message);
        })
        .catch(err => next(err));
}

// Uploads a new file
function upload(req, res, next){
    courseService.upload(req).then(x => {
        if (!x){
            res.json('Invalid access');
            return;
        }
        const file = req.body;
        const base64data = file.content.replace(/^data:.*,/, '');
        fs.writeFile(userFiles + file.name, base64data, 'base64', (err) => {
            if (err) {
                res.sendStatus(500);
            } else {
                res.set('Location', userFiles + file.name);
                res.status(200);
                res.send(file);
            }
        });
    })
}

// Retrieves a file given the file name
function getFile(req, res, next){
    courseService.getFile(req).then(x => {
        if (!x){
            res.json('Invalid access');
        }
        else{
            const file = path.join(__dirname, '../user_upload', req.params.name);
            res.contentType("application/pdf");
            res.sendFile(file);
        }
    })
}

// Updates the access code of a course
function updateAccessCode(req, res, next){
    courseService.updateAccessCode(req).then(x => {
        res.json(x);
    })
}

// Retrieves the access code of a course
function getAccessCode(req, res, next){
    courseService.getAccessCode(req).then(x => {
        res.json(x);
    })
}

// Updates the visibility of a course
function updateVisibility(req, res, next){
    courseService.updateVisibility(req.body.id, req.body.visibility).then(x => {
        res.json(x);
    })
}

// Creates a new post for a course
function newPost(req, res, next){
    courseService.newPost(req.body.post, req).then(x => {
        res.json(x);
    })
}

// Retrieves all the posts of a course given the course ID and user role
function retrievePosts(req, res, next){
    courseService.retrievePosts(req.params.id, req.user.sub).then(x => {
        res.json(x);
    })
}

// Creates a new comment for a given post given the post ID and comment content
function postComment(req, res, next) {
    courseService.postComment(req.body.postID, req.body.content, req).then(x => {
        res.json(x);
    })
}

// Returns a list of courses visible to the user
function getCourses(req,res,next){
    courseService.getAllCourses(req).then(courses => {
        userService.getById(req.user.sub).then(x => {
            //x is our user
            let answer = [];
            if (x.role.toString().localeCompare('Guest') === 0){
                courses.forEach(element => {
                    if (element.public){
                        answer.push(element);
                    }
                });
                 res.json(answer);
                 return;
            }
            let userCourses = x.courses;
            courses.forEach(element => {
                let current = userCourses.find(c => c.toString().localeCompare(element._id) == 0);
                if (current){
                    answer.push(element);
                }
            });
            //Return the courses back to the user
            res.json(answer)
        }).catch(err => next(err));
        })
}

// Returns a list of enrolled students for the given course ID
function getEnrolledStudents(req,res,next){
    courseService.getEnrolledStudents(req.params.id).then(students => {
        res.json(students)}).catch(err => next(err));
}

// Deletes a course given the course ID
function deleteCourse(req,res,next){
    courseService.deleteCourse(req.params.id).then(courses => {
        res.json(courses)}).catch(err => next(err));
}
