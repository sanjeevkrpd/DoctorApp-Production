const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const { getAllUserController ,  getAllDoctorController , changeAccountStatusController} = require('../controllers/adminCtrl');

// router object
const router = express.Router();

// get Method || all users 
router.get("/getAllUsers",authMiddleware, getAllUserController);

// get Method || all doctors

router.get("/getAllDoctors",authMiddleware, getAllDoctorController);


// post 

router.post("/changeAccountStatus", authMiddleware,changeAccountStatusController);

module.exports = router;