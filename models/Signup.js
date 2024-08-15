import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true

    },
    password: {
        type: String,
        required: true,
        lowercase: true
    },
    email:{
        type: String,
        required: true
    }

})
export const  Signup = mongoose.model("signup", signupSchema)