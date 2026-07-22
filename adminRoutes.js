const express = require('express');
const { getUsers, getDoctors, approveDoctor, getAllAppointments, deleteUser, getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/doctors').get(protect, admin, getDoctors);
router.route('/doctors/:id/approve').put(protect, admin, approveDoctor);
router.route('/appointments').get(protect, admin, getAllAppointments);
router.route('/stats').get(protect, admin, getAdminStats);

module.exports = router;
