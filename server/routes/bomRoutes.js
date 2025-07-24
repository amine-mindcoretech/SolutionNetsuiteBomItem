// routes/bomRoutes.js

const express = require('express');
const bomController = require('../controllers/bomController');

const router = express.Router();
router.get('/search', bomController.searchBomByName);
router.get('/:id', bomController.getBom);
router.post('/', bomController.createBom);

module.exports = router;
