import { User } from "../models/usersModel.js";

// Helper function to get the start and end of a specific day
const getDayRange = (date) => {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0); // Set to start of the day in UTC
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999); // Set to end of the day in UTC
    return { start, end };
};

// Helper function to get the start and end of a month in UTC
const getMonthRange = (year, month) => {
    const start = new Date(Date.UTC(year, month - 1, 1)); // First day of the month in UTC
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)); // First day of the next month in UTC
    end.setMilliseconds(end.getMilliseconds() - 1); // Last millisecond of the last day of the month
    return { start, end };
};

export const getReport = async (req, res) => {
    const { date, month } = req.body;
    console.log(date, month);

    let users = [];

    try {
        if (month) {
            const [year, monthNumber] = month.split('-');
            console.log("Year and month:", year, monthNumber);

            const monthRange = getMonthRange(parseInt(year), parseInt(monthNumber));

            const { start, end } = monthRange;

            // Aggregate query to count the number of times each user appears in the specified month
            users = await User.aggregate([
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                },
                {
                    $group: {
                        _id: "$username",
                        count: { $sum: 1 },
                        details: { $first: "$$ROOT" }
                    }
                },
                {
                    $match: {
                        count: { $gte: 1 } // Change to 1 if you want users who appear at least once
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: "$details"
                    }
                }
            ]);
 

        } else if (date) {
            const { start, end } = getDayRange(date);
            users = await User.find({ createdAt: { $gte: start, $lte: end } }).exec();
        } 

        if (users.length > 0) {
            return res.status(200).json(users);
        }

        return res.status(400).json({ message: `No user was recorded on the specified date` });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server error" });
    }
};