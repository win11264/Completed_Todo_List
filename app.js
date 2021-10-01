// const { sequelize } = require('./models');
// sequelize.sync({ force: true });
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const listRoute = require("./routes/listRoute");
const authRoute = require("./routes/authRoute");
const utils = require("util");
const errorController = require("./controllers/errorController");
const { User } = require("./models");
const passport = require("passport");
const { List } = require("./models");
const cloudinary = require("cloudinary").v2;
require("./config/passport");

const uploadPromise = utils.promisify(cloudinary.uploader.upload);

const app = express();

app.use(passport.initialize());

// Test Passport
// app.get(
//   "/test-passport",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.json(req.user);
//   }
// );

// middleware cors: allow access cross origin sharing
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// Config Multer Multi-Form Data
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       console.log(file);
//       cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//       cb(null, new Date().getTime() + "." + file.mimetype.split("/")[1]);
//     },
//   }),
// });

// Upload to local file
// app.put("/upload", upload.single("thisisuploadinput"), async (req, res) => {
//   try {
//     console.log(req.file.path);
//     await List.update({ imageUrl: req.file.path }, { where: { id: 1 } });
//     res.status(200).json({ message: "Image has been uploaded successfully" });
//   } catch (error) {
//     next(error);
//   }
// });

// Upload to cloudinary
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // console.log(file);
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime() + "." + file.mimetype.split("/")[1]);
    },
  }),
});

app.post(
  "/upload-to-cloud",
  upload.single("cloudinput"),
  async (req, res, next) => {
    console.log(req.file);
    const { username, password, email, confirmPassword } = req.body;
    // cloudinary.uploader.upload(req.file.path, async (err, result) => {
    //   if (err) console.log(err);
    //   else console.log(result);
    //   fs.unlinkSync(req.file.path);
    //   await List.update({ imageUrl: result.secure_url }, { where: { id: 2 } });
    //   res.json("Uploaded");
    // });

    // try {
    //   const result = await uploadPromise(req.file.path);
    //   await List.update({ imageUrl: result.secure_url }, { where: { id: 1 } });
    //   fs.unlinkSync(req.file.path);
    //   res.json("Uploaded");
    // } catch (error) {
    //   next(error);
    // }

    try {
      const result = await uploadPromise(req.file.path);
      const user = await User.create({
        username,
        password: result.secure_url,
        email,
      });
      fs.unlinkSync(req.file.path);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
);

// list route
app.use("/lists", listRoute);
// authenticate route
app.use("/", authRoute);

// path not found handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "resource not found on this server" });
});
// 24548
// error handling middleware
app.use(errorController);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server running on port ${port}`));
