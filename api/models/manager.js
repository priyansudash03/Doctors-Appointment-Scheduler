const express = require('express');
const mongoose = require('mongoose');

const managerSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

exports.Manager = mongoose.model("Manager",managerSchema);