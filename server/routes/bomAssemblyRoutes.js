//bomAssemblyRoutes.js
const express = require('express');
const bomAssemblyController = require('../controllers/bomAssemblyController');

const router = express.Router();

router.post('/', bomAssemblyController.linkBomToAssembly);

module.exports = router;
