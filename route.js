import express from "express";
const router = express.Router()

import { signup } from "./controller/signup.js";
import { login } from "./controller/login.js";
import { JwtValidation } from "./controller/jwt.js";
import { submitinfo } from "./controller/submit.js";
import { SignAttendance } from "./controller/signAttendance.js";
import { allUsers } from "./controller/Getallusers.js";
import { currentUsers } from "./controller/currentAttandance.js";
import { searchForUser } from "./controller/searchForAttandant.js";
import { getReport } from "./controller/getReport.js";
import { absentees } from "./controller/Absentees.js";
import { weeekAttedance } from "./controller/getWeek.js";


 
router.post("/signup", signup);//Create a new user
router.post("/login", login)// Login in validation
router.post("/submit", submitinfo)
router.post("/attendance", SignAttendance) 
router.get("/allUsers", allUsers)//get all users
router.get("/currentusers", currentUsers)//Get todays users
router.get("/searchuser", searchForUser)//search for users
router.post("/report", getReport) // Get report base on specified date
router.get("/absentees", absentees)//Get absentees
router.get("/weeekAttedance", weeekAttedance)//weekly attandance


 

export default router 