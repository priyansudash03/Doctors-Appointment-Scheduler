const express = require('express');
const router = express.Router();
const {Appointment} = require('../models/appointment');
const {Patient} = require('../models/patient');

router.get('/',async (req,res)=>{
    let filter = {};
    if(req.query.doctor){
        filter = {doctor: req.query.doctor};
    }
    if(req.query.patient){
        filter = {patient: req.query.patient};
    }
    const appointmentList = await Appointment.find(filter).populate('patient','first_name last_name age gender blood_group phone').populate('doctor','first_name last_name');
    if(!appointmentList){
        return res.status(404).json({success: false, message: 'No appointments found'})
    }
    res.status(200).send(appointmentList);
});

router.get('/count',async (req,res)=>{
    try{
        const count = await Appointment.countDocuments();
        res.json({success: true,count});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false,message: 'Internal server error'});
    }     
});

router.post('/',async (req,res)=>{
    let appointment = new Appointment({
        patient : req.body.patient,
        date_time : req.body.date_time,
        doctor : req.body.doctor,
        status : req.body.status,
        priority : req.body.priority
    });
    appointment = await appointment.save();
    if(!appointment){
        return res.status(500).json({success: false,message: "Appoinment can't be created"});
    }
    res.status(201).json({success: true,message: 'Appointment created successfully'});
});

router.put('/completed',async (req,res)=>{
    let filter = {};
    if(req.query.number){
        filter = {phone: req.query.number};
    }
    let findPatient = await Patient.find(filter);
    let patientID = findPatient[0]._id.toString();
    let findappointment = await Appointment.findOne({patient: findPatient[0]._id});
    try{
        let appointment;
        if(req.body.doctor){
            appointment = await Appointment.findByIdAndUpdate(findappointment._id.toString(),{
                doctor : req.body.doctor,
                status: 'forwarded'
            },{new: true});
        }else{
            appointment = await Appointment.findByIdAndUpdate(findappointment._id.toString(),{
                status: 'completed'
            },{new: true});
        }
        res.status(201).json({success: true,message: 'Appointment Updated'});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false,message: 'Internal Server Error'})
    }
});

module.exports = router;