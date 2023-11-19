const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  createuser: async (req, res) => {
    let success = false;
    // if there are errors, return the bad request and the errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }

    try {
      // check the user with this email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "sorry a user with this email is alredy exist",
        });
      }
      
     // check the user with this username exist already
      let username = await User.findOne({ username: req.body.username });
      if (username) {
        return res.status(400).json({
          success,
          error: "sorry a user with this username is alredy exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create a new user

      user = await User.create({
        username: req.body.username,
        name: req.body.name,
        lname: req.body.lname,
        email: req.body.email,
        password: secPass,
        image: req.body.image,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
  login: async (req, res) => {
    let success = false;
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "please try to login using correct email." });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "please try to login using correct password.",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
  whoami: async (req, res) => {
    let success = false;

    try {
      let userId = req.user.id;
      const data = await User.findById(userId).select("-password");
      // console.log(user);
      success = true;
      res.json({ success, data });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error Occured");
    }
  },
  getuserbyid: async (req, res) => {
    try {
      let userId = req.params.id;
      const user = await User.findById(userId).select("-password");
      // console.log(user);
      res.send(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error Occured");
    }
  },
  alluser: async (req, res) => {
    try {
      const alluser = await User.find({}).select("-password");
      res.send({ status: "ok", data: alluser });
    } catch (error) {
      console.log(error);
    }
  },
  getalluser: async (req, res, next) => {
    // console.log(req.params.id);
    try {
      let user = await User.findById({ _id: req.params.id }).select(
        "-password"
      );
      // console.log(user);
      res.send({ status: "ok", user: user });
    } catch (error) {
      console.log(error);
      res.status(404).send("user not found");
    }
  },
  followUser: async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;
    console.log(id, _id);
    if (_id == id) {
      res.status(403).json("Action Forbidden");
    } else {
      try {
        const followUser = await User.findById(id);
        const followingUser = await User.findById(_id);

        if (!followUser.followers.includes(_id)) {
          await followUser.updateOne({ $push: { followers: _id } });
          await followingUser.updateOne({ $push: { following: id } });
          res.status(200).json("User followed!");
        } else {
          res.status(403).json("you are already following this id");
        }
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    }
  },
  unfollowUser: async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    if (_id === id) {
      res.status(403).json("Action Forbidden");
    } else {
      try {
        const unFollowUser = await User.findById(id);
        const unFollowingUser = await User.findById(_id);

        if (unFollowUser.followers.includes(_id)) {
          await unFollowUser.updateOne({ $pull: { followers: _id } });
          await unFollowingUser.updateOne({ $pull: { following: id } });
          res.status(200).json("Unfollowed Successfully!");
        } else {
          res.status(403).json("You are not following this User");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    }
  },
  // Update user
  updateUser: async (req, res) => {
    // Get the user ID from the request.
    const userId = req.user.id;

    // If the user ID is provided, try to find the user object in MongoDB.
    if (userId) {
      try {
        const user = await User.findById(userId).select("-password");
        // If the user object is found, update it with the new information provided in the request body.
        if (user) {
          if (req.body.name) {
            user.name = req.body.name;
          }
          if (req.body.lname) {
            user.lname = req.body.lname;
          }
          if (req.body.email) {
            user.email = req.body.email;
          }
          if (req.body.image) {
            user.image = req.body.image;
          }

          // Save the updated user object to MongoDB.
          await user.save();

          // Send a response to the client with the updated user object.
          res.status(200).json({ message: "User updated successfully", user });
        } else {
          // If the user object is not found, return a 404 Not Found error.
          res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        // If an error occurs, return a 500 Internal Server Error.
        res.status(500).json({ message: "Internal server error" });
      }
    } else {
      // If the user ID is not provided, return a 400 Bad Request error.
      res.status(400).json({ message: "User ID is required" });
    }
  },
};
