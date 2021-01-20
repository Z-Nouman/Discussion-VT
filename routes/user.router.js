var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
const Role = require('../_helpers/role');
const authorize = require('../_helpers/authorize');

router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);
router.post('/joincourse', authorize(Role.student), userController.joinCourse);
router.get(`/getUser/:id`, authorize(Role.professor), userController.getUser);
module.exports = router;
