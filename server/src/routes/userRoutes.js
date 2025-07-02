const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');

router.use(protect);

router.post('/', authorize('user:create'), userController.create);
router.get('/', authorize('user:read'), userController.getAll);
router.put('/:id', authorize('user:update'), userController.update);
router.delete('/:id', authorize('user:delete'), userController.delete);

module.exports = router;
