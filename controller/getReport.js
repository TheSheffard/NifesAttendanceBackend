import { User } from "../models/users.model.js";

// Helper function to get the start and end of a specific day
const getDayRange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};


// Helper function to get the start and end of a month
const getMonthRange = (year, month) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    return { start, end };
};

export const getReport = async (req, res) => {

    const { date, month } = req.body;

    let users = [];

    try {


        if (month) {
            const [year, monthNumber] = month.split('-');
            const { start, end } = getMonthRange(parseInt(year), parseInt(monthNumber));

            // Aggregate query to count the number of times each user appears in the specified month

            users = await User.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end }
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
                        count: { $gte: 2 }
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

        if (users.length > 0) return res.status(200).json(users);

 
        return res.status(400).json({ message: `No user was recorded on the specified date` });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message: "Server error"})

    }


}