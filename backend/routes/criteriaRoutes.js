const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createCriteria, assignCriteriaToFaculty, getCriterias, getMyCriterias, bulkUpsertCriteria, assignByNames, getCriteriaWithAssignments } = require('../controllers/criteriaController');

const router = express.Router();

// Allow evaluators to also view criteria (read-only)
const adminOrEvaluator = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'evaluator')) {
    next();
  } else {
    res.status(403);
    return res.json({ message: 'Access denied.' });
  }
};

router.route('/').post(protect, admin, createCriteria).get(protect, adminOrEvaluator, getCriterias);
router.route('/assign').put(protect, admin, assignCriteriaToFaculty);
router.route('/bulk-upsert').post(protect, admin, bulkUpsertCriteria);
router.route('/assign-by-names').put(protect, admin, assignByNames);
router.route('/with-assignments').get(protect, admin, getCriteriaWithAssignments);
router.route('/mine').get(protect, getMyCriterias);

// Debug endpoint to check user criteria
router.get('/debug/my-criteria', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id).populate('assignedCriteria');
    res.json({
      userId: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      assignedCriteriaCount: user.assignedCriteria?.length || 0,
      assignedCriteria: user.assignedCriteria || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
