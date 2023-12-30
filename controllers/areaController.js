const Area = require("../models/Area");

exports.addArea = (req, res, next) => {
  const { nameArea } = req.body;
  if (!nameArea) {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } else {
    const area = new Area({
      nameArea,
    });
    area
      .save()
      .then((result) => {
        res.status(201).json({
          status: true,
          message: "Thêm Area Thành Công",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

exports.getAreas = async (req, res, next) => {
  if (req.query.page && req.query.limit) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalUser = await Area.countDocuments();
      const areas = await Area.find({}).skip(skip).limit(limit);

      res.status(200).json({
        areas,
        currentPage: page,
        totalPages: Math.ceil(totalUser / limit),
        totalItems: totalUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    const areas = await Area.find({});
    res.status(200).json(areas);
  }
};

exports.putArea = async (req, res, next) => {
  const _id = req.params.id;
  const { nameArea } = req.body;
  Area.findById(_id)
    .then((huyit) => {
      huyit.nameArea = nameArea;
      return huyit.save();
    })
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Cập Nhật Khu Vực Thành Công",
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
        res
          .status(200)
          .json({ status: true, message: "Xóa Khu Vực Thành Công" });
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
