const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const {Manager} = require('../models/manager');

router.get('/',async (req,res)=>{
    const managerList = await Manager.find();
    if(!managerList) return res.status(404).json({success: false,message: 'No manager found'});
    res.status(200).send(managerList);
});

router.get('/count',async (req,res)=>{
    const count = await Manager.countDocuments();
    if(!count) return res.status(404).json({success: false, message: 'No manager found'});
    res.status(200).json({count});
});

router.get('/login',async (req,res)=>{
    const manager = await Manager.findOne({phone: req.query.phone});
    if(!manager) return res.status(404).json({success: false,message: 'No manager found'});
    if(bcrypt.compareSync(req.query.password, manager.password)){
        res.status(200).json({success: true, message: 'Logged In'});
    }else{
        res.status(401).json({success: false, message: 'Invalid Password'})
    }
})

router.post('/register',async (req,res)=>{
    let manager = new Manager({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10)
    });
    manager = await manager.save();
    if(!manager) return res.status(500).json({success:false, message: 'Manager cannot be added'});
    res.status(201).json({success: true, message: 'Manager Added'});
});

module.exports = router;