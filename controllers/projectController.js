const Project = require("../models/Project");
const Task = require("../models/Task");

exports.addProject = (req, res, next) => {
  const { nameProject, teamSize, dateOfStart, budget, status, expense } =
    req.body;
  if (
    !nameProject ||
    !teamSize ||
    !dateOfStart ||
    !budget ||
    !status ||
    !expense
  ) {
    res.status(200).json({ status: false, message: "Không Được Để Trống" });
  } else {
    const project = new Project({
      nameProject,
      teamSize,
      dateOfStart,
      budget,
      expense,
      status,
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

// exports.getProjects = async (req, res, next) => {
//   const selectedValue = req.query.huydev;
//   // console.log(selectedValue);
//   let huydev;

//   if (selectedValue) {
//     huydev = await Task.findOne({ idProject: selectedValue }).populate([
//       {
//         path: "idProject",
//       },
//       {
//         path: "assignedTo",
//       },
//     ]);
//   } else {
//     huydev = await Project.find({});
//   }

//   res.status(200).json(huydev);
// };

exports.getProjects = async (req, res, next) => {
  if (req.query.huydev) {
    const selectedValue = req.query.huydev;
    const projectTasks = await Task.findOne({
      idProject: selectedValue,
    }).populate([
      {
        path: "idProject",
      },
      {
        path: "assignedTo",
      },
    ]);

    const projectTasksArray = await Task.find({
      idProject: selectedValue,
      assignedTo: { $ne: null },
    });

    const projectUsersMap = new Map(); // Sử dụng Map để lưu trữ thông tin dự án và danh sách người dùng tương ứng
    // tim task co status dang xu ly
    const processingTasks = projectTasksArray.filter(
      (task) => task.status === "processing"
    );

    const completeTasks = projectTasksArray.filter(
      (task) => task.status === "complete"
    );

    // console.log(processingTasks);

    // lap de lay du lieu

    projectTasksArray.forEach((task) => {
      const projectId = task.idProject.toString();
      const userId = task.assignedTo.toString();

      if (projectUsersMap.has(projectId)) {
        // Dự án đã tồn tại trong Map
        const users = projectUsersMap.get(projectId);
        // console.log(users);
        if (!users.includes(userId)) {
          // Người dùng chưa tồn tại trong danh sách người dùng của dự án
          users.push(userId);
        }
      } else {
        // Dự án chưa tồn tại trong Map, thêm dự án và người dùng vào Map
        projectUsersMap.set(projectId, [userId]);
      }
    });
    // console.log(projectUsersMap);
    const projectUsersCount = Array.from(projectUsersMap.values()).map(
      (users) => users.length
    )[0];

    res.status(200).json({
      projectTasks,
      totalUsers: projectUsersCount,
      processingTasks: processingTasks.length,
      completeTasks: completeTasks.length,
    });
  } else if (req.query.page && req.query.limit) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalProject = await Project.countDocuments(); // Tổng số task
      const projects = await Project.find({}).skip(skip).limit(limit);

      res.status(200).json({
        projects,
        currentPage: page,
        totalPages: Math.ceil(totalProject / limit),
        totalItems: totalProject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    const huydev = await Project.find({});
    res.status(200).json(huydev);
  }
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
  const { nameProject, teamSize, dateOfStart, budget, status, expense } =
    req.body;
  Project.findById(_id)
    .then((huyit) => {
      huyit.nameProject = nameProject;
      huyit.teamSize = teamSize;
      huyit.dateOfStart = dateOfStart;
      huyit.budget = budget;
      huyit.status = status;
      huyit.expense = expense;

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
