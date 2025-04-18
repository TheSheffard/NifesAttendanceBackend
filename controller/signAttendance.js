
import { Attendance } from "../models/AttendanceModel.js";
import { User } from "../models/usersModel.js"

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}
const currentDate = new Date();
let weekNumber


const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);




export const SignAttendance = async (req, res) => {
    const { userId, weeknumber } = req.body

    //check if week number is present 
    weekNumber = weeknumber ? getWeekNumber(currentDate) - weeknumber : getWeekNumber(currentDate)


    try {
 
        // Check if the user has already been marked present today
        const checkAttendance = await Attendance.findOne({
            userId: userId,
  
            createdAt: {
                $gte: startOfDay, 
                $lte: endOfDay
            }
        });
 

        if (checkAttendance) {// If the user has been marked present, throw an error

            return res.status(400).json({ message: "This Attendant is already present for today" })

        } else {


            await Attendance.create({
                week: `${weekNumber}`,
                userId: userId
            })

            return res.status(200).json({ message: "Attendant is now present for today" });

        }


    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Server Error" })
    }


}



