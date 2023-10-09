const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Patient',
        required : true
    },
    date_time : {
        type : String,
        required : true
    },
    doctor : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    priority:{
        type: String,
        default: 'general'
    }
},{timestamps: true});

exports.Appointment = mongoose.model("Appointment", appointmentSchema);