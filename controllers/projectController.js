const Project = require("../models/Project");

exports.addProject = (req, res, next) => {
  const { nameProject, teamSize, dateOfStart } = req.body;
  if (nameProject == "" || teamSize == "" || dateOfStart == "") {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } else {
    const project = new Project({
      nameProject,
      teamSize,
      dateOfStart,
    });
    project
      .save()
      .then((result) => {
        res.status(201).json({
          status: true,
          message: "Thêm Project Thành Công",
          project: result,
        });
      })
      .catch((err) => {
        console.log(err);
        // if (!err.statusCode) {
        //   err.statusCode = 500;
        // }
        // next(err);
      });
  }
};

exports.getProjects = async (req, res, next) => {
  const project = await Project.find({});
  res.status(200).json(project);
};

exports.getIdProject = async (req, res, next) => {
  try {
    const id = req.params.id;
    const projectId = await Project.findOne({ _id: id });
    res.status(200).json(projectId);
  } catch (error) {
    console.log(error);
  }
};

exports.putProject = async (req, res, next) => {
  const _id = req.params.id;
  const { nameProject, teamSize, dateOfStart } = req.body;
  Project.findById(_id)
    .then((huyit) => {
      huyit.nameProject = nameProject;
      huyit.teamSize = teamSize;
      huyit.dateOfStart = dateOfStart;
      return huyit.save();
    })
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Cập Nhật Project Thành Công",
        project: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteProject = (req, res, next) => {
  const _id = req.params.id;
  Project.deleteOne({ _id: _id })
    .then((post) => {

      if (post.deletedCount > 0) {
        res
          .status(200)
          .json({ status: true, message: "Xóa Project Thành Công" });
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
