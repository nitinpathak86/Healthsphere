const express = require('express');
const { getDoctors, bookAppointment, getAppointments, cancelAppointment } = require('../controllers/patientController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/doctors').get(getDoctors);
router.route('/appointments').post(protect, bookAppointment).get(protect, getAppointments);
router.route('/appointments/:id/cancel').put(protect, cancelAppointment);

module.exports = router;
