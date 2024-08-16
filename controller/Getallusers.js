import { Signup } from "../models/Signup.js";
import { User } from "../models/users.model.js";

export const allUsers = async (req, res) => {

    try {
        const user = await User.find()

        if (user.length === 0) return res.status(400).json({ message: "No user found" })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: "Server error"})
    }
} 