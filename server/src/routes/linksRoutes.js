const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', linksController.create);
router.get('/', linksController.getAll);
router.get('/:id', linksController.getById);
router.put('/:id', linksController.update);
router.delete('/:id', linksController.delete);
router.get('/redirect/:id', linksController.redirect);

module.exports = router;
