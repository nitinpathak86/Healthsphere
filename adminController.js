const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).populate('userId', 'name email');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
        
        doctor.isApproved = true;
        await doctor.save();
        res.json({ message: 'Doctor approved successfully', doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('patientId', 'name email')
            .populate({ path: 'doctorId', populate: { path: 'userId', select: 'name email' } });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (user.role === 'doctor') {
            await Doctor.findOneAndDelete({ userId: user._id });
        }
        
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User and associated data deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminStats = async (req, res) => {
    try {
        const patientsCount = await User.countDocuments({ role: 'patient' });
        const doctorsCount = await User.countDocuments({ role: 'doctor' });
        const approvedDoctorsCount = await Doctor.countDocuments({ isApproved: true });
        const appointmentsCount = await Appointment.countDocuments({});
        
        res.json({
            patients: patientsCount,
            doctors: doctorsCount,
            approvedDoctors: approvedDoctorsCount,
            appointments: appointmentsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, getDoctors, approveDoctor, getAllAppointments, deleteUser, getAdminStats };
