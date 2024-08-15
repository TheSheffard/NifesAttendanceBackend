import express from "express"
import dotenv from "dotenv"
import route from "./route.js"
import mongoose from "mongoose"
import cookieParser from 'cookie-parser'



const app = express();
dotenv.config()

// Middleware to parse cookies
app.use(cookieParser());
 
const port = process.env.PORT || 4000;
 


// Body parser middleware to handle form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// Route
app.use('/', route); 
 



const startsever = async () => {
    try {
         await mongoose.connect(process.env.MONGO_URI)  
        .then(() => {
            console.log("Connected to MongoDB!");
        });

        app.listen(port, () => {
            console.log(`app  listening on ${port}`);
        })
    } catch (e) {
        console.log(e.message + "Error connecting to Database")
    }   
}   
startsever()   