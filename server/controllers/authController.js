const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "user already exists" });
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPass });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,  
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Auth Controller Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const userExist = await User.findOne({ email });
    if (!userExist)
      return res.status(401).json({ message: "Invalid credentials" });
    const passCompare = await bcrypt.compare(password, userExist.password);
    if (!passCompare)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(userExist._id);
    res.json({
      _id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      role: userExist.role,
      token,
    });
  } catch (err) {
    console.error("Auth Controller Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginUser, registerUser };
