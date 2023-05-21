const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (username === "" || email === "" || password === "") {
    return res
      .status(200)
      .json({ status: false, message: "Vui lòng nhập đầy đủ thông tin" });
  } else {
    try {
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(200)
          .json({ status: false, message: "Email đã được đăng ký trước đó" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      const payload = {
        user: {
          id: savedUser._id,
          username,
          email,
        },
      };

      jwt.sign(payload, "LeQuocHuy", { expiresIn: 3600 }, (err, token) => {
        if (err) {
          return res
            .status(200)
            .json({ status: false, message: "Lỗi Nghiêm Trọng" });
        }

        res.status(200).json({
          status: true,
          message: "Đăng ký thành công",
        });
      });
    } catch (err) {
      return res
        .status(200)
        .json({ status: false, message: "Lỗi trong quá trình đăng ký" });
    }
  }
};

// login

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "Username đăng nhập không tồn tại" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(200)
        .json({ status: false, message: "Mật khẩu không đúng" });
    }

    const payload = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
      },
    };

    jwt.sign(payload, "LeQuocHuy", { expiresIn: "24h" }, (err, token) => {
      if (err) {
        return res
          .status(200)
          .json({ status: false, message: "Lỗi Nghiêm Trọng" });
      }
      res.status(200).json({
        status: true,
        message: "Đăng nhập thành công",
        accessToken: token,
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Lỗi trong quá trình đăng nhập" });
  }
};
