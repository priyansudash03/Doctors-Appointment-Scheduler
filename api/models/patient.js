const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    first_name : {
        type: String,
        required : true
    },
    last_name : {
        type: String,
        required : true
    },
    age : {
        type: String,
        required: true
    },
    image : {
        imageName: {
            type: String
        },
        imageURL: {
            type: String,
            default : ""
        }
    },
    gender : {
        type: String,
        required : true
    },
    date_of_birth : {
        type: String,
        required: true
    },
    blood_group : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required : true
    },
    password : {
        type: String,
        required: true
    },
    phone : {
        type: Number,
        required: true
    },
    address : {
        street:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        zip:{
            type: Number,
            required: true
        }
    }
});

exports.Patient = mongoose.model("Patient", patientSchema);