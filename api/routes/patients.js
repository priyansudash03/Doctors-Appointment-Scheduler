const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const {Patient} = require('../models/patient');
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
    let patientList;
    if(req.query.id){
        patientList = await Patient.findById(req.query.id);
    }
    else if(req.query.number){
        console.log(req.query.number)
        patientList = await Patient.find({phone : req.query.number});
        console.log(patientList)
    }
    else{
        patientList = await Patient.find();
    }
    if(!patientList || (Array.isArray(patientList) && patientList.length === 0)) {
        return res.status(404).json({ success: false, message: 'No patients found' });
    }
    if(Array.isArray(patientList)){
        for(const patient of patientList){
            const getObjectParams = {
                Bucket: bucketName,
                Key: patient.image.imageName
            }
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            patient.image.imageURL = url;
        }
    }else{
        const getObjectParams = {
            Bucket: bucketName,
            Key: patientList.image.imageName
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        patientList.image.imageURL = url;
    }
    res.status(200).send(patientList);
    
});

router.get('/count',async (req,res)=>{
    try{
        const count = await Patient.countDocuments();
        res.json({success: true,count});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false,message: 'Internal server error'});
    }     
});

router.post('/',upload.single('image'),async (req,res)=>{
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
        let patient = new Patient({
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            age : req.body.age,
            image : {
                imageName : imageNames
            },
            gender : req.body.gender,
            date_of_birth : req.body.date_of_birth,
            blood_group : req.body.blood_group,
            email : req.body.email,
            password : bcrypt.hashSync(req.body.password,10),
            phone : req.body.phone,
            address : {
                street : req.body.street,
                city : req.body.city,
                state : req.body.state,
                zip : req.body.zip
            },
            
        });
        patient = await patient.save();
        if(!patient){
           return res.status(500).json({success: false, message: 'Patient cannot be added'}); 
        }
        res.status(201).json({success: true, message: "Patient Added"});
    }catch(e){
        res.status(500).json({success: false, message: e});
    }
});

module.exports = router;