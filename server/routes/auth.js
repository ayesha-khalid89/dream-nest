const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/user");
//configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//USER REGISTER
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    //take all info from form
    const { firstName, lastName, email, password } = req.body;
    //the uploaded file is available as req.file
    const profileImage = req.file;
    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }
    //path to the uploaded profile photo
    const profileImagePath = profileImage.path;

    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User exists" });
    }

    //hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      profileImagePath,
    });

    //save the new user
    await newUser.save();
    res.status(200).json({ message: "User Registered", user: newUser });
  } catch (err) {
    cconsole.log(err);
    res.status(400).json({ message: "registeration failed" });
  }
});

//USER LOGIN

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }
    //generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    console.log("login failed");
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
