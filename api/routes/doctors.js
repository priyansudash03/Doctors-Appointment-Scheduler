const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const {Doctor} = require('../models/doctor');
const multer = require('multer');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: bucketRegion
});

router.get('/',async (req,res)=>{
    let filter = {};
    if(req.query.speciality){
        filter  = {speciality: req.query.speciality};
    }
    const doctorsList = await Doctor.find(filter);
    if(!doctorsList){
        return res.status(500).json({success: false, message: 'Server error'});
    }
    for(const doctor of doctorsList){
        const getObjectParams = {
            Bucket: bucketName,
            Key: doctor.image.imageName
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        doctor.image.imageURL = url;
    }
    
    res.status(200).send(doctorsList);
});

router.get('/count',async (req,res)=>{
    try{
        const count = await Doctor.countDocuments();
        res.json({success: true,count});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false,message: 'Internal server error'});
    }     
});

router.post('/register',upload.single('image'), async (req,res)=>{
    try{
        let imageNames;
        if(req.file){
            const buffer = await sharp(req.file.buffer).resize({ height: 1080, width: 1920, fit: 'contain' }).toBuffer();
            imageNames = `${Date.now()}_${req.file.originalname}`;
            const params = {
                Bucket: bucketName,
                Key: imageNames,
                Body: buffer,
                Content: req.file.mimetype
            }
            const command = new PutObjectCommand(params);
            await s3.send(command);
        }
        let doctor = new Doctor({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            image : {
                imageName: imageNames
            },
            gender : req.body.gender,
            date_of_birth : req.body.date_of_birth,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password,10),
            phone : req.body.phone,
            address : {
                street : req.body.street,
                city : req.body.city,
                state : req.body.state,
                zip : req.body.zip
            },
            speciality : req.body.speciality,
            qualifications : req.body.qualifications,
            work_schedule : {
                days_of_week : req.body.days_of_week,
                start_time : req.body.start_time,
                end_time : req.body.end_time
            },
            is_active : req.body.is_active
        });
        doctor = await doctor.save();
        if(!doctor){
           return res.status(500).json({success: false, message: 'Doctor cannot be added'}); 
        }
        res.status(201).json({success: true, message: "Doctor Added"});
    }catch(e){
        res.status(500).json({success: false, message: e});
    }
});

router.get('/login',async (req,res)=>{
    const doctor = await Doctor.findOne({phone: req.query.phone});
    if(!doctor){
        return res.status(404).json({success:false, message: "No patient found"})
    }
    if(bcrypt.compareSync(req.query.pass, doctor.password)){
        res.status(200).json({success: true, message: 'Logged In'});
    }else{
        res.status(401).json({success: false, messaage: 'Invalid password'});
    }
})

module.exports = router;