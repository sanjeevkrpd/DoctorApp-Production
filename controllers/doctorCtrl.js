const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointment");
const userModel = require("../models/userModel");
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor details",
      error: error.message, // Send specific error message for debugging
    });
  }
};
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Doctor updated Successfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "doctor profile update issue",
      error: error.message, // Send specific error message for debugging
    });
  }
};

const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });

    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully", // Corrected spelling
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching appointments",
      error: error.message, // Send specific error message for debugging
    });
  }
};

const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );

    const user = await userModel.find({ _id: appointmentsId.userId });
    const notification = user.notification;
    notification.push({
      type: "status-updated",
      message: `Your appointment has been updated to ${status}`, // Added space before status
      onClickPath: "/doctor-appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment status updated",
      data: updatedAppointment, // Optionally send the updated appointment details
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating status",
      error: error.message, // Send specific error message for debugging
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  doctorAppointmentsController,
  updateStatusController,
};
