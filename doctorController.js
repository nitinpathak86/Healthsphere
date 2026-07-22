const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendNotification } = require('../utils/notification');

const getProfile = async (req, res) => {
    try {
        let doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name email');
        if (!doctor) {
            // Fallback: Create profile if missing
            doctor = await Doctor.create({ userId: req.user._id, specialization: 'General Physician', fees: 0, experience: 0 });
            await doctor.populate('userId', 'name email');
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { specialization, experience, fees, availableSlots } = req.body;
    try {
        let doctor = await Doctor.findOne({ userId: req.user._id });
        if (doctor) {
            doctor.specialization = specialization || doctor.specialization;
            doctor.experience = experience || doctor.experience;
            doctor.fees = fees || doctor.fees;
            if (availableSlots) {
                doctor.availableSlots = availableSlots;
            }
            const updatedDoctor = await doctor.save();
            res.json(updatedDoctor);
        } else {
            doctor = await Doctor.create({
                userId: req.user._id,
                specialization,
                experience,
                fees,
                availableSlots: availableSlots || []
            });
            res.status(201).json(doctor);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppointments = async (req, res) => {
    try {
        let doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            doctor = await Doctor.create({ userId: req.user._id, specialization: 'General Physician', fees: 0, experience: 0 });
        }

        const appointments = await Appointment.find({ doctorId: doctor._id })
            .populate('patientId', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body; 
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        appointment.status = status;
        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const manageAppointment = async (req, res) => {
    const { status } = req.body; // 'accepted', 'rejected', 'cancelled', 'completed'
    try {
        const appointment = await Appointment.findById(req.params.id).populate('patientId', 'name email');
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        const doctor = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name');
        if (appointment.doctorId.toString() !== doctor._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        appointment.status = status;
        await appointment.save();

        // Notify Patient
        sendNotification(appointment.patientId.email, `Appointment ${status}`, `Dr. ${doctor.userId.name} has ${status} your appointment on ${appointment.date}.`);

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProfile, updateProfile, getAppointments, updateAppointmentStatus, manageAppointment };
