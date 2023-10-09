const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Database
mongoose.connect(process.env.MONGODB_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
.then(() => console.log("Connected to database"))
.catch(e => console.log(e));

// Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Routes
const doctorsRouter = require('./routes/doctors');
const patientRouter = require('./routes/patients');
const appointmentRouter = require('./routes/appointments')

app.use("/doctors", doctorsRouter);
app.use("/patients", patientRouter);
app.use('/appointments', appointmentRouter);

app.listen(3000,()=>{
    console.log("Server started at port 3000");
})