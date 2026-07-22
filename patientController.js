const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Review = require('../models/Review');
const { sendNotification } = require('../utils/notification');

const getDoctors = async (req, res) => {
    const { specialization, search, sortBy, sortOrder } = req.query;
    try {
        let query = { isApproved: true };
        
        if (specialization) {
            query.specialization = specialization;
        }
        
        let doctors = await Doctor.find(query).populate('userId', 'name email');
        
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            doctors = doctors.filter(doctor => 
                doctor.userId.name.match(searchRegex) || 
                doctor.specialization.match(searchRegex)
            );
        }

        if (sortBy) {
            const order = sortOrder === 'desc' ? -1 : 1;
            doctors.sort((a, b) => (a[sortBy] > b[sortBy] ? order : -order));
        }

        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookAppointment = async (req, res) => {
    const { doctorId, date, time } = req.body;
    try {
        // Prevent double booking
        const existingAppointment = await Appointment.findOne({ doctorId, date, time });
        if (existingAppointment) {
            return res.status(400).json({ message: 'Time slot already booked' });
        }
        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            date,
            time,
            status: 'pending'
        });

        // Notify Doctor
        const doctor = await Doctor.findById(doctorId).populate('userId', 'name email');
        if (doctor && doctor.userId) {
            sendNotification(doctor.userId.email, 'New Appointment Request', `Patient ${req.user.name} has requested an appointment on ${date} at ${time}.`);
        }

        res.status(201).json(appointment);
    } catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ message: error.message || 'Server error during booking' });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id })
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name' } });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        
        if (appointment.patientId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        appointment.status = 'cancelled';
        await appointment.save();
        res.json({ message: 'Appointment cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addReview = async (req, res) => {
    const { doctorId, rating, comment } = req.body;
    try {
        const review = await Review.create({
            patientId: req.user._id,
            doctorId,
            rating,
            comment
        });

        const doctor = await Doctor.findById(doctorId);
        const reviews = await Review.find({ doctorId });
        
        doctor.reviewCount = reviews.length;
        doctor.averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        
        await doctor.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDoctors, bookAppointment, getAppointments, cancelAppointment, addReview };
