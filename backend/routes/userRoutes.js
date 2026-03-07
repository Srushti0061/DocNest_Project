const express = require('express');
const { registerAdmin, authUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { registerFaculty, getFaculty, deleteFaculty, getFacultyWithCriteria } = require('../controllers/userController');
const { registerStudent, registerEvaluator } = require('../controllers/userController');

const router = express.Router();

router.post('/admin/register', registerAdmin);
router.post('/login', authUser);
router.route('/faculty').post(protect, admin, registerFaculty);
router.route('/faculty').get(protect, admin, getFaculty);
router.route('/faculty/:id').get(protect, admin, getFacultyWithCriteria);
router.route('/faculty/:id').delete(protect, admin, deleteFaculty);
router.post('/student/register', registerStudent);
router.post('/evaluator/register', registerEvaluator);

// Health check endpoint
router.get('/test', (req, res) => {
  res.status(200).send('Backend is healthy');
});

module.exports = router;
