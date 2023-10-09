const express = require('express');
const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    first_name : {
        type: String,
        required : true
    },
    last_name : {
        type: String,
        required : true
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
    },
    speciality : {
        type: String,
        required: true
    },
    qualifications:{
            type: String
        },
    work_schedule : {
        days_of_week : [
            {
                type: String,
                required: true
            }
        ],
        start_time : {
            type: String,
            required: true
        },
        end_time : {
            type: String,
            required: true
        }
    },
    is_active : {
        type: Boolean,
        required: true
    }
});

exports.Doctor = mongoose.model("Doctor",doctorSchema);