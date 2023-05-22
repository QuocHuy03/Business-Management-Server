const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  const { username, email, password, area } = req.body;
  if (username === "" || email === "" || password === "" || area === "") {
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
        area,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      const payload = {
        user: {
          id: savedUser._id,
          username,
          area,
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
    const userArea = await User.find({}).populate("area", "nameArea");
    console.log(userArea);
    const payload = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        area: userArea[0].area.nameArea,
        level: user.level,
      },
    };

    jwt.sign(payload, "LeQuocHuy", { expiresIn: "7200" }, (err, token) => {
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

exports.verifyAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(accessToken, "LeQuocHuy", (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      console.log(decoded);
      const { user } = decoded;
      res.json(user);
    }
  });
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json(users);
};
