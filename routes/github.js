express = require('express');

const githubController = require('../controllers/github');
const router = express.Router();

router.post('/', githubController.postGithub);

module.exports = router;