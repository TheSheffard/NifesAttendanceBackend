import jwt from "jsonwebtoken"
import { Signup } from "../models/Signup.js";

export const signup = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    

    let user; 

    try {
        user = await Signup.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (user) return res.status(400).json({ message: `This user already exist` })


    } catch (e) {
        console.log(e.message)
       return res.status(500).json({ message: " Error occured while checking for user" })
    }

    if (password !== process.env.AdMIN_PASSWORD) {
        return res.status(400).json({ message: `Accesss Denied, Only Authorised Admin Can Signup` })
    }

    try {
        await Signup.create({
            username,
            email,
            password: password,
        })

        const data = {
            username,
            email  
        }

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "30d" })
        res.cookie("token", token) 

        return res.status(200).json({ message: "Sign up successful" });


    } catch (e) {
        console.log(e.message)
       return res.status(400).json({ message: "Error occured while trying to create new user" })
    }

};