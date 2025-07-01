const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const { protect } = require('../middleware/authMiddleware');

router.get('/r/:id', linksController.redirect);
router.get('/redirect/:id', linksController.redirect);

router.use(protect);

router.post('/', linksController.create);
router.get('/', linksController.getAll);
router.get('/:id', linksController.getById);
router.put('/:id', linksController.update);
router.delete('/:id', linksController.delete);

module.exports = router;
