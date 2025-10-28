/** @format */
import User from "../models/usersModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//! signout controller
export const signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Signout successful" });
};

//! signin controller
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, password: user.password },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
    res.status(200).json({ message: "Signin successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//! get user controller
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//! 



//! send verification code controller
// export const sendVerificationCode = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     const verificationCode = Math.floor(Math.random() * 1000000).toString();
//     let info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Email Verification",
//       text: `Your verification code is: ${verificationCode}`,
//     });
//     if (info.accepted[0] === user.email) {
//       console.log("Email sent successfully");
//     } else {
//       console.log("Email not sent");
//     }
//     user.verificationCode = verificationCode;
//     await user.save();
//     res.status(200).json({ message: "Verification code sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const sendVerificationCode = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email is required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Always 6-digit code
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//     // Send email
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: "Email Verification",
//       text: `Your verification code is: ${verificationCode}`,
//     });

//     if (!info.accepted.includes(user.email)) {
//       return res.status(500).json({ message: "Failed to send verification email" });
//     }

//     // Save verification code to DB
//     user.verificationCode = verificationCode;
//     await user.save();

//     console.log(`Verification code for ${email}: ${verificationCode}`); // for testing
//     res.status(200).json({ message: "Verification code sent successfully" });
//   } catch (error) {
//     console.error("Send verification code error:", error); // ✅ log the real error
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };
