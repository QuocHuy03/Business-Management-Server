const User = require("../models/User");

exports.updateUser = async (req, res, next) => {
  const _id = req.params.id;
  const { level, status } = req.body;
  User.findById(_id)
    .then((huyit) => {
      huyit.level = level;
      huyit.status = status;
      return huyit.save();
    })
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Cập Nhật Thành Viên Thành Công",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteArea = (req, res, next) => {
  const _id = req.params.id;
  Area.deleteOne({ _id: _id })
    .then((post) => {
      if (post.deletedCount > 0) {
        res.status(200).json({ status: true, message: "Xóa Area Thành Công" });
      } else {
        const error = new Error("Không tìm thấy danh mục này");
        error.statusCode = 404;
        throw error;
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
