import { Attendance } from "../models/Attendance.js";
import { User } from "../models/users.model.js";

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export const absentees = async (req, res) => {
    const { weeknumber } = req.query; 

    const currentDate = new Date();
    const lastWeekNumber = getWeekNumber(currentDate) - 1;
    // const thisWeekNumber = getWeekNumber(currentDate);
    console.log(lastWeekNumber)



    try {
        //Get last week number 
        const lastSundayAttandance = await Attendance.find({
            week: lastWeekNumber.toString()
        }).populate('userId');

        //Get the current week number 
        const thisWeekAttendance = await Attendance.find({
            week: weeknumber.toString()
        }).populate('userId');
        console.log(weeknumber)



        if (lastSundayAttandance.length === 0 ) return res.status(400).json({ message: "No records were submitted last sunday" })

        if (thisWeekAttendance.length === 0) return  res.status(400).json({ message: "No records have been submitted this week" })

        // Extract userIds for both weeks
        const lastWeekUserIds = new Set(lastSundayAttandance.map(record => record.userId._id.toString()));
        const thisWeekUserIds = new Set(thisWeekAttendance.map(record => record.userId._id.toString()));

        // Find absentees: users present last week but absent this week
        const absentees = Array.from(lastWeekUserIds).filter(userId => !thisWeekUserIds.has(userId));


        // Fetch user details for absentees
        const absenteeDetails = await User.find({ _id: { $in: absentees } });

        return res.status(200).json(absenteeDetails);

 
    }catch(error) {
        console.log(error.message)
        return res.status(500).json({ message: "Server error" })

    }  
}