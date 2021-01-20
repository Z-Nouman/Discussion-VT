const db = require('../_helpers/database');
const mongoose = require("mongoose");
const Course = db.Course;
const User = db.User;
const Post = db.Comment;

module.exports = {
    getAllCourses,
    addCourse,
    deleteCourse,
    getEnrolledStudents,
    updateAccessCode,
    getAccessCode,
    updateVisibility,
    postComment,
    newPost,
    retrievePosts,
    getComments,
    editComment,
    deleteComment,
    deletePost,
    removeUser,
    upload,
    getFile
};

// Uploads a file
async function upload(req){
    //Check if the user is registered to the courseID
    const person = await User.findOne({"_id": req.user.sub});
    if (!person.courses.includes(req.body.courseID)){
        return false;
    }
    return true;
}

// Retrieves a file
async function getFile(req){
    const post = await Post.findOne({"pdf": req.params.name});
    const course = await Course.findOne({"comments": post._id});
    const person = await User.findOne({"_id": req.user.sub});
    if ((!person.courses.includes(course._id)) && !course.public){
        return false;
    }
    return true;
}

// Removes an enrolled user from a course
async function removeUser(userID, courseID){
    const person = await User.findOne({"_id": userID});
    let courseList = person.courses;
    const fullName = person.firstName + " " + person.lastName;
    let index = -5;
    for (const element of courseList){
        if (element.toString().localeCompare(courseID) === 0){
            index = courseList.indexOf(element);
        }
    }
    if (index >= 0){
        courseList.splice(index, 1);
        await User.updateOne({"_id": userID}, {$set: {"courses": courseList}});
    }
    return "Successfully removed " + fullName;
}

// Deletes a post
async function deletePost(id){
    const course = await Course.findOne({"comments": id});
    let allComments = course.comments;
    const courseID = course._id;
    let index = -5;
    for (const element of allComments){
        if (element.toString().localeCompare(id) === 0){
            index = allComments.indexOf(element);
        }
    }
    if (index >= 0){
        allComments.splice(index, 1);
        await Course.updateOne({"_id": courseID}, {$set: {"comments": allComments}});
    }
    await Post.deleteOne({"_id": id});
    return "Successfully deleted a post!";

}

// Deletes a comment
async function deleteComment(unique, postID, req){
    const username = req.user.sub;
    let person = await User.findOne({"_id": username});
    const post = await Post.findOne({"_id": postID});
    let allComments = post.commentContent;
    let index = -5;
    for (const element of allComments){
        //Check each element to find the index
        if (element.unique.toString().localeCompare(unique) === 0){
            index = allComments.indexOf(element);
        }
    }
    //If the person trying to delete the comment is not a professor nor the student themself, return an error
    if (person.role !== 'Professor' && username.toString().localeCompare(allComments[index].userID.toString())){
        return 'Invalid access';
    }
    if (index >= 0){
        allComments.splice(index, 1);
    }
    return await Post.updateOne({"_id": postID}, {$set: {"commentContent": allComments}});
}

// Edits an existing comment
async function editComment(content, id, newComment, req){
    const username = req.user.sub;
    let person = await User.findOne({"_id": username});

    //If the user is not a professor nor the student themself, return an error
    if (person.role !== 'Professor' && username.toString().localeCompare(content.userID) !== 0){
        return 'Invalid access';
    }
    //Find the comment, copy it and replace the content, and place it back in
    const post = await Post.findOne({"_id": id});
    let allComments = post.commentContent;
    let index = -5;
    for (const element of allComments){
        //Check each element to find the index
        if (element.unique.toString().localeCompare(content.unique) === 0){
            index = allComments.indexOf(element);
        }
    }
    if (index >= 0){
        allComments[index] = {
            firstName: content.firstName,
            lastName: content.lastName,
            comment: newComment,
            userID: content.userID,
            unique: content.unique
        }
    }
    return await Post.updateOne({"_id": id}, {$set: {"commentContent": allComments}});
}

// Get a list of all comments for a post
async function getComments(id, userID){
    //Only give comments if that person is registered or the course is public
    const course = await Course.findOne({"comments": id});
    const person = await User.findOne({"_id": userID});
    if ((!person.courses.includes(course._id)) && !course.public){
        return [];
    }
    const data = await Post.findOne({"_id": id});
    return data.commentContent;
}

// Creates a new comment and assigns it to the corresponding post
async function postComment(id, comment, req){
    const username = req.user.sub;
    const person = await User.findOne({"_id": username});
    const course = await Course.findOne({"comments": id});
    if (!person.courses.includes(course._id)){
        return 'You are not registered for this course';
    }
    await Post.updateOne({"_id": id}, {$push: {"commentContent": comment}});
    return 'Successfully added a new comment!';
}

// Retrieves all the posts for a course
async function retrievePosts(id, userID){
    let person = await User.findOne({"_id": userID});
    let answer = [];
    let course = await Course.findOne({"_id": id});
    if ((!person.courses.includes(id)) && !course.public){
        return answer;
    }
    for (const element of course.comments) {
        answer.push(await Post.findOne({"_id": element}))
    }
    return answer;
}

// Creates a new post
async function newPost(data, req){
    //Check if the user is registered to the course
    const person = await User.findOne({"_id": req.user.sub});
    if (!person){
        return 'Invalid credentials';
    }
    let flag = false;
    if (!person.courses.includes(data.courseID)){
        return 'You are not registered for this course';
    }
    //If the user already has a pdf in that course: delete the existing post and create a new one at the end of the list
    let currentPost = await Post.findOne({"pdf": data.pdf});
    if (currentPost){
        flag = true;
        await Post.deleteOne({"pdf": data.pdf});
        let currentComments = await Course.findOne({"_id": data.courseID});
        const index = currentComments.comments.indexOf(data.pdf);
        currentComments.comments.splice(index, 1);
        await Course.updateOne({"_id": data.courseID}, {$set: {comments: currentComments.comments}});
    }

    const newPost = new Post(data);
    await newPost.save();
    await Course.updateOne({"_id": data.courseID}, {$push: {"comments": newPost._id}});
    if (flag){
        return 'Updated post!';
    }
    else{
        return 'Created a new post!';
    }
}

// Returns a list of all courses
async function getAllCourses() {
    return await Course.find({});
}

// Deletes a course given the ID
async function deleteCourse(id) {
     return await Course.deleteOne({"_id":id});
}

// Updates a course's visibility
async function updateVisibility(id, visibility) {
    await Course.updateOne({"_id": id}, {"public": visibility});
    return visibility;
}

// Returns a list of all enrolled students within a course
async function getEnrolledStudents(id) {
    return await User.find({'courses': mongoose.Types.ObjectId(id), role:'Student'}).select('-hash -courses');
}

// Creates a random string given a length
function randStr(len) {
    let s = '';
    while (len--) { s += String.fromCodePoint(Math.floor(Math.random() * (126 - 33) + 33)); }
    return s;
}

// Updates the access code of a course, invalidating the previous one
async function updateAccessCode(req){
    let courses = await Course.find({});
    let code = randStr(50);
    let counter = 1;
    while (counter > 0) {
        counter = courses.length;
        courses.forEach(course => {
            if (course.accessCode.toString().localeCompare(code.toString()) == 0){
                code = randStr(50);
                counter++;
            }
            else{counter--}
        });
    }
    await Course.updateOne({"_id": req.body.courseID}, {"accessCode": code});
    return code;
}

// Retrieves the access code of a course
async function getAccessCode(req){
    return Course.findOne({"_id": req.params.id});
}

// Creates a new course
async function addCourse(req) {
    let course = req.body;

    // validate
    if (await Course.findOne({ courseNumber: course.courseNumber, courseDept: course.courseDept, CRN: course.CRN, season: course.season, year: course.year  })) {
        throw 'Course "' + course.courseDept + course.courseNumber +'" already exists';
    }
    else if(!req.user.sub){
        throw 'Error with the user submitting request. User information missing. Malformed request.';
    }
    //populate missing fields in the course object
    course.createdBy = req.user.sub;
    course.createdDate =  Date.now();

    course = new Course(course);

    // save course
    return await course.save();
}
