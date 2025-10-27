const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/ordersController');

// Protect all order routes
router.use(auth);

router.get('/', ctrl.list);
router.post('/:id/approve', ctrl.approve);
router.post('/:id/reject', ctrl.reject);
router.get('/:id/pdf', ctrl.pdf);

module.exports = router;
