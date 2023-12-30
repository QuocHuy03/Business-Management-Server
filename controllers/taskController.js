const Task = require("../models/Task");
const Project = require("../models/Project");

exports.addTask = (req, res, next) => {
  const { taskName, description, idProject, priority, assignedTo, status } =
    req.body;
  if (
    !taskName ||
    !description ||
    !idProject ||
    !priority ||
    !assignedTo ||
    !status
  ) {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } else {
    const task = new Task({
      taskName,
      description,
      idProject,
      priority,
      assignedTo,
      status,
    });
    task
      .save()
      .then((result) => {
        res.status(201).json({
          status: true,
          message: "Thêm Task Thành Công",
          project: result,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.getTasks = async (req, res, next) => {
  if (req.query._id && req.query.page && req.query.limit) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalTasks = await Task.countDocuments({
        assignedTo: req.query.idUser,
      }); // Tổng số task

      const tasks = await Task.find({ assignedTo: req.query._id })
        .populate("idProject", "nameProject")
        .populate("assignedTo", "username")
        .skip(skip)
        .limit(limit);

      // console.log("Task : ",tasks);

      res.status(200).json({
        tasks,
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalItems: totalTasks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.query.page && req.query.limit) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalTasks = await Task.countDocuments(); // Tổng số task

      const tasks = await Task.find({})
        .populate("idProject", "nameProject")
        .populate("assignedTo", "username")
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        tasks,
        currentPage: page,
        totalPages: Math.ceil(totalTasks / limit),
        totalItems: totalTasks,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    try {
      const tasks = await Task.find({})
        .populate("idProject", "nameProject")
        .populate("assignedTo", "username");
      res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

exports.getIdTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const taskId = await Task.findOne({ _id: id });
    res.status(200).json(taskId);
  } catch (error) {
    console.log(error);
  }
};

exports.putTask = async (req, res, next) => {
  const _id = req.params.id;
  const { taskName, description, idProject, priority, assignedTo, status } =
    req.body;
  Task.findById(_id)
    .then((huyit) => {
      huyit.taskName = taskName;
      huyit.description = description;
      huyit.idProject = idProject;
      huyit.priority = priority;
      huyit.assignedTo = assignedTo;
      huyit.status = status;
      return huyit.save();
    })
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Cập Nhật Task Thành Công",
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

exports.deleteTask = (req, res, next) => {
  const _id = req.params.id;
  Task.deleteOne({ _id: _id })
    .then((post) => {
      if (post.deletedCount > 0) {
        res
          .status(200)
          .json({ status: true, message: "Xóa Project Thành Công" });
      } else {
        res
          .status(200)
          .json({ status: false, message: "Không tìm thấy danh mục này" });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
