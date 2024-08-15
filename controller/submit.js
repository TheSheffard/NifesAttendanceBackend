import { User } from "../models/users.model.js";
import { Attendance } from "../models/Attendance.js";

function getWeekNumber(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;

    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

export const submitinfo = async (req, res) => {


    const { username, levelinschool, lodgename, phonenumber, courseofstudy, dcg, dateofbirth, stateoforigin, gender } = req.body;

    if (!username || !levelinschool || !lodgename || !phonenumber || !courseofstudy || !dcg || !dateofbirth || !stateoforigin || !gender) {
        return res.status(400).json({ message: "All input fields are required" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const currentWeekNumber = getWeekNumber(new Date());
    console.log(currentWeekNumber)
    console.log(username)


    let checkUser;
    try {   


        // Check if the user exists in the database by phone number
        checkUser = await User.findOne({ phonenumber })

        if (checkUser) {
            // Check if the user has already been marked present today
            const attendance = await Attendance.findOne({
                userId: checkUser._id,

                createdAt: {
                    $gte: startOfDay,
                    $lte: endOfDay
                }
            });


            if (attendance) {// If the user has been marked present, throw an error

                return res.status(400).json({ message: ` The user with this number ${checkUser.phonenumber} has already been marked present today` })

            } else {

                await Attendance.create({
                    week: `${currentWeekNumber}`,
                    userId: checkUser._id
                })

                return res.status(200).json({ message: `${checkUser.username} has been marked present today` });

            }



        } else {



            // create record for new user 
            const newUser =   await User.create({
                username,
                levelinschool,
                lodgename,
                phonenumber,
                courseofstudy,
                dcg,
                dateofbirth,
                stateoforigin,
                gender
            });

             // Mark the new user present for today
             await Attendance.create({
                week: `${currentWeekNumber}`,
                userId: newUser._id
            });

            return res.status(200).json({ message: "A new user has been added to the database and marked present today" });
        }


    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ message: "Server Error" })
    }


}



