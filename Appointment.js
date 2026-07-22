const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // HH:mm
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected', 'cancelled'], 
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
