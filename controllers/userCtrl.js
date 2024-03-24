const userModel = require("../models/userModel.js");
const doctorModel = require("../models/doctorModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const appointmentModel = require("../models/appointment.js");
const moment = require("moment");

const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "User Already Exists" });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({ success: true, message: "Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });

    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Email or Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ success: true, message: "Login Successfully", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Login Controller${error.message}` });
  }
};

const authCtrl = async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.body.userId });
    console.log(user);
    user.password = undefined;
    if (!user) {
      return res.status(500).send({
        message: "user not found",
        success: false,
        data: user,
      });
    } else {
      return res.status(200).send({
        message: "user found",
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};
// notification controller

const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });

    // Move existing notifications to seennotification array
    user.seennotification.push(...user.notification);
    user.notification = []; // Clear the notification array

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      message: "All notifications marked as seen",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in updating notifications",
      success: false,
      error,
    });
  }
};

// delete
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });

    user.notification = [];
    user.seennotification = [];

    const updatedUser = await user.save();

    updatedUser.password = undefined;
    res.status(200).send({
      message: "All notification deleted Successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "unable to delete all notification",
      success: false,
      error,
    });
  }
};

const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });

    res.status(200).send({
      success: true,
      message: "All Docors",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "unable to get all doctors",
      success: false,
      error,
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    let doctor = await doctorModel.findById({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in Single doc Info",
      success: false,
      error,
    });
  }
};

// booking Appointment controller

const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });

    user.notification.push({
      type: "New-Appointment-Request ",
      message: `A new appointment request from ${req.body.userInfo.name} `,
      onClickPath: "/user-appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment Book SuccessFully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in booking an appointment",
      success: false,
      error,
    });
  }
};

// booking availibilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const formTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString(); // Corrected the time format from "HH:MM" to "HH:mm"
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString(); // Corrected the time format from "HH:MM" to "HH:mm"
    const doctorId = req.body.doctorId;

    const appointment = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: formTime, // Changed $get to $gte for "greater than or equal to"
        $lte: toTime, // Changed $let to $lte for "less than or equal to"
      },
    });

    if (appointment.length > 0) {
      return res.status(200).send({
        message: "Appointment is not available at this time",
        success: false, // Changed to false since appointment is not available
      });
    } else {
      return res.status(200).send({
        message: "Appointment Book Successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send({
      message: "Error in Finding Availability",
      success: false,
      error: error.message, // Send only the error message to the client
    });
  }
};

const userAppointmentController = async (req, res) => {
  try {
    console.log(req.body);
    const appointements = await appointmentModel.find({
      userId: req.body.userId,
    });
    return res.status(200).send({
      message: "User's Appointments Fetch SuccessFully",
      success: true, // Changed to false since appointment is not available
      data: appointements,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send({
      message: "Error in Fetching Appointments",
      success: false,
      error: error.message, // Send only the error message to the client
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authCtrl,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorController,
  getDoctorById,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentController,
};
