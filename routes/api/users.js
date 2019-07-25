const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const bcrpyt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const config = require("config");
//@router POST /api/users
//@desc   Test Route
//access  Public
router.post(
  "/",
  [
    check("name", "Name is Required")
      .not()
      .isEmpty(),
    check("email", "Email needs to Be Valid").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters",
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    //see if user exists
    try {
      let user = await User.findOne({
        email,
      });
      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "user alreay exists",
            },
          ],
        });
      }

      //get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "mm",
        d: "mp",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encypt password
      const salt = await bcrpyt.genSalt(10);
      user.password = await bcrpyt.hash(password, salt);
      await user.save();
      //Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSec"),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  },
);

module.exports = router;
