//itemSuiteqlRoutes.js
const express = require('express');
const suiteqlController = require('../controllers/itemSuiteqlController');

const router = express.Router();

router.get('/items', suiteqlController.getAllItems);
router.get('/item/:displayName', suiteqlController.getItemByDisplayName);
router.get('/subitems', suiteqlController.getSubitems);
router.get('/departments', suiteqlController.getDepartments);
router.get('/locations', suiteqlController.getLocations);

module.exports = router;