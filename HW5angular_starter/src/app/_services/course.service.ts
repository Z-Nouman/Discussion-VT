import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Comment, Course, Post} from '../_models/course';
import {User} from '../_models/user';

@Injectable({ providedIn: 'root' })
export class CourseService {
    constructor(private http: HttpClient) { }

    // Return all courses
    getAll() {
        return this.http.get<Course[]>(`http://localhost:4000/course/getcourses`);
    }

    // Return a specific course given a course ID
    getCourse(id: string) {
        return this.http.get<Course>(`http://localhost:4000/course/getAccessCode${id}`);
    }

    // Updates the visibility of a course
    getVisibility(iden: string, vis: boolean) {
        return this.http.post(`http://localhost:4000/course/updateVisibility`, {id: iden, visibility: vis});
    }

    // Creates a new post
    newPost(data: Post) {
        return this.http.post(`http://localhost:4000/course/newPost`, {post: data});
    }

    // Returns the post of a course given the course ID
    retrievePosts(id: string): any {
        return this.http.get(`http://localhost:4000/course/retrievePosts${id}`);
    }

    // Creates a new comment for a post given the post ID and the content of the comment
    postComment(id: string, comment: Comment) {
        return this.http.post(`http://localhost:4000/course/postComment`, {postID: id, content: comment});
    }

    // Returns the comments of a post given the post ID
    getComments(id: string) {
        return this.http.get<[]>(`http://localhost:4000/course/getComments/${id}`);
    }

    // Updates the access code for a course, invalidating the previous access code
    updateAccessCode(id: string) {
        return this.http.post('http://localhost:4000/course/updateaccesscode', {courseID: id});
    }

    // Edits the contents of a comment
    editComment(content: Comment, id: string, newContent: string) {
        return this.http.post(`http://localhost:4000/course/editComment/`, {data: content, postID: id, newComment: newContent});
    }

    // Deletes a comment
    deleteComment(commentID: string, postID: string) {
        return this.http.post(`http://localhost:4000/course/deleteComment`, {content: commentID, post: postID});
    }

    // Returns all the students enrolled within a course
    getEnrolledStudents(courseID: string) {
        return this.http.get<any>(`http://localhost:4000/course/getstudents${courseID}`);
    }

    // Deletes a post
    deletePost(id: string) {
        return this.http.delete(`http://localhost:4000/course/deletePost/${id}`);
    }

    // Removes an enrolled student from a course
    removeUser(user: User, id: string) {
        return this.http.post(`http://localhost:4000/course/removeUser`, {userID: user._id, courseID: id});
    }

    // Creates a new course
    createCourse(course: Course) {
        return this.http.post(`http://localhost:4000/course/addcourse`, course);
    }

}
