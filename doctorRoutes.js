const express = require('express');
const { getProfile, updateProfile, getAppointments, updateAppointmentStatus, manageAppointment } = require('../controllers/doctorController');
const { protect, doctor } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/profile').get(protect, doctor, getProfile).put(protect, doctor, updateProfile);
router.route('/appointments').get(protect, doctor, getAppointments);
router.route('/appointments/:id').put(protect, doctor, updateAppointmentStatus);
router.route('/appointments/:id/manage').put(protect, doctor, manageAppointment);

module.exports = router;
