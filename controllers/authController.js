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

      jwt.sign(
        payload,
        "access_token_secret",
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            return res
              .status(200)
              .json({ status: false, message: "Lỗi Nghiêm Trọng" });
          }

          res.status(200).json({
            status: true,
            message: "Đăng ký thành công",
          });
        }
      );
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
    // console.log(userArea);
    const payload = {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        area: userArea[0].area.nameArea,
        level: user.level,
      },
    };
    const accessToken = jwt.sign(payload, "access_token_secret", {
      expiresIn: "10m",
    });
    // Tạo mã refresh token
    const refreshToken = jwt.sign(payload, "refresh_token_secret", {
      expiresIn: "7d",
    });
    res.status(200).json({
      status: true,
      message: "Đăng nhập thành công",
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Lỗi trong quá trình đăng nhập" });
  }
};

exports.verifyAccessToken = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  jwt.verify(accessToken, "access_token_secret", (err, decoded) => {
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
  if (req.query.page && req.query.limit) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalUser = await User.countDocuments();
      const users = await User.find({})
        .populate(["area"])
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        users,
        currentPage: page,
        totalPages: Math.ceil(totalUser / limit),
        totalItems: totalUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    const users = await User.find({}).populate(["area"]);
    res.status(200).json(users);
  }
};


exports.getInfoUser = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  // console.log(accessToken);
  try {
    const decodedToken = jwt.decode(accessToken);
    res.json(decodedToken.user);
  } catch (error) {
    throw new Error("Failed to decode access token");
  }
};
exports.refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  try {
    const decoded = jwt.verify(refreshToken, "refresh_token_secret");

    // Tạo mã access token mới
    const accessToken = jwt.sign(
      { user: decoded.user },
      "access_token_secret",
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.updateUser = async (req, res, next) => {
  const accessToken = req.headers.authorization.split(" ")[1];
  // console.log(req.body);
  try {
    const decodedToken = jwt.decode(accessToken);
    const userId = decodedToken.user.id;
    // console.log(userId)
    await User.findByIdAndUpdate(userId, {
      username: req.body.username,
      email: req.body.email,
      level: req.body.level,
    });
    res.status(200).json({ message: "Update successfully" });
  } catch (error) {
    throw new Error("Failed to decode access token");
  }
};
