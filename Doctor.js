const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    fees: { type: Number, required: true },
    availableSlots: [
        {
            date: { type: String },
            time: { type: String } 
        }
    ],
    isApproved: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
