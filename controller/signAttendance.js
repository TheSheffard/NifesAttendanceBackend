import mongoose from "mongoose"
import { Attendance } from "../models/Attendance.js"
import { User } from "../models/users.model.js"

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}
const currentDate = new Date();
const weekNumber = getWeekNumber(currentDate) - 1;


export const SignAttendance = async (req, res) => {


    // Save the current week number

         
    const { userId } = req.body
    if (!mongoose.isValidObjectId(userId)) return res.status(400).json({ message: `Invalide  ID` })




    console.log(weekNumber, userId)

    const attendanceAlreadyTaken = await Attendance.findOne({week: `${weekNumber}`})

    
    if (attendanceAlreadyTaken)  return res.status(400).json({messae: 'Attendance already taken'})
    



    try {
        await Attendance.create({
            week: `${weekNumber}`,
            userId: new mongoose.Types.ObjectId(`${userId}`)
        })
        console.log("yes")
        return res.status(200).json({message: "Attendance has been marked"})

    } catch (error) {
        console.log(error.messge)
        return res.status(500).json({message: 'Something went wrong'})
    }







}