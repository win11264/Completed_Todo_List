const express = require('express');
const listController = require('../controllers/listController');
const { authenticate } = require('../controllers/authController');

const router = express.Router();

router.get('/', authenticate, listController.getAllLists);
router.get('/:id', authenticate, listController.getListById);
router.post('/', authenticate, listController.createList);
router.put('/:id', authenticate, listController.updateList);
router.delete('/:id', authenticate, listController.deleteList);

// // For Admin Only
// router.get('/users', authenticate, checkRole('ADMIN'), userControlles.getAllUsers)
// // For Customer Only
// router.get('/user/:id', authenticate, checkRole('CUSTOMER'))
// // For Shop Only

// // For Shop or Customer
// router.get('/user/:id', authenticate,

module.exports = router;
