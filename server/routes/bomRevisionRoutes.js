// routes/bomRoutes.js

const express = require('express');
const bomRevisionController = require('../controllers/bomRevisionController'); // ✅ Import du contrôleur BOM Revision

const router = express.Router();


router.post('/', bomRevisionController.createBomRevision); // ✅ Nouvelle route pour BOM Revision

module.exports = router;
