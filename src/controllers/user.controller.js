const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user.models");

//Signup Controller
exports.signUp = async (req, res) => {
    const { userName, password } = req.body;
    try {
        //Check if username and password are provided
        if (!userName || !password) {
            return res
                .status(400)
                .json({ message: "Please provide username and password" });
        }
        //Check if user already exists
        const user = await User.findOne({ userName });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        //Hash the password
        const harshedPassword = await bcrypt.hash(password, 10);

        //Generate Otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        //Create a new user
        const newUser = new User({ userName, password: harshedPassword, otp });
        //Save the new user to the database
        await newUser.save();
        return res.status(201)
            .json({ message: "User created successfully", data: newUser })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
};

//Signin controller 
exports.login = async (req, res) => {
    const { userName, password }  = req.body;
    try {
        // Check if username and password are provided
        if (!userName && !password) {
            return res
            .status(400)
            .json({ message: "Please provide username and password" });
        }
        //find the user by username
        const user = await User.findOne({ userName: userName });
        if(!user) {
            return  res.status(401).json({ message: "Invalid Username" });
        }
        //Compare the provided password with the harshed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid Password" });
        }
 // Generate a JWT token
 const token = jwt.sign({ id: user._id},
process.env.JWT_SECRET, {
   expiresIn: "1h",
});
   return res.status(200).json({ message: "Logged in successfully", token });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
}
};

//Otp verification controller
exports.verify = async (req, res) => {
    const {otp} = req.body;
    try {
       if (!otp) {
        return res.status(400).json({ message: "Please provide Otp" });
       }  
       const user = await User.findOne({ otp: otp });
       if (!user) {
         return res.status(401).json({ message: "Invalid OTP" });
       }
       user.otp = null;
       await user.save();
       return res.status(200).json({ message: "Otp Verified Successfully", data: user });
    } catch (error) {
       console.error(error);
       return res.status(500).json({ message: "Internal Server Error"});
    }
};