const express = require("express");
const {
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
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

// router object
const router = express.Router();

// routes
// Login ||  POST

router.post("/login", loginController);

// Register || POST
router.post("/register", registerController);

// Auth || POST
router.post("/getUserData", authMiddleware, authCtrl);

// Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);
module.exports = router;

// Notification   || POST
router.get("/user-appointments", authMiddleware, userAppointmentController);
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);
module.exports = router;

// Delete Notification   || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

// Get All Doctor

router.get("/getAllDoctors", authMiddleware, getAllDoctorController);

// get single doctor
router.post("/getDoctorById", authMiddleware, getDoctorById);

//book appointment

router.post("/book-appointment", authMiddleware, bookAppointmentController);

//booking availbility
router.post(
  "/booking-availibility",
  authMiddleware,
  bookingAvailabilityController
);

// Appointment list

module.exports = router;
