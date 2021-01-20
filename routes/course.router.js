var express = require('express');
var router = express();
const courseController = require('../controllers/course.controller');
const Role = require('../_helpers/role');
const authorize = require('../_helpers/authorize');

router.post('/addcourse', authorize(Role.professor), courseController.createCourse);
router.get('/getcourses', courseController.getCourses);
router.delete('/:id',authorize(Role.professor), courseController.deleteCourse);
router.get('/getstudents:id',authorize(Role.professor), courseController.getEnrolledStudents);
router.post('/updateaccesscode', authorize(Role.professor), courseController.updateAccessCode);
router.get(`/getAccessCode:id`, authorize(Role.professor), courseController.getAccessCode);
router.post(`/updateVisibility`, authorize(Role.professor), courseController.updateVisibility);
router.post(`/postComment`, courseController.postComment);
router.post(`/newPost`, authorize(Role.student), courseController.newPost);
router.put(`/upload`, authorize(Role.student), courseController.upload);
router.get(`/getFile/:name`, courseController.getFile);
router.get(`/retrievePosts:id`, courseController.retrievePosts);
router.get(`/getComments/:id`, courseController.getComments);
router.post(`/editComment`, courseController.editComment);
router.post(`/deleteComment`, courseController.deleteComment);
router.delete(`/deletePost/:id`, authorize(Role.professor), courseController.deletePost);
router.post(`/removeUser`, authorize(Role.professor), courseController.removeUser);

module.exports = router;
