const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");
const areaController = require("../controllers/areaController");
const verifyAccessToken = require("../middleware/verifyAcessToken");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/addProject", projectController.addProject);
router.get("/getProjects", projectController.getProjects);
router.get(
  "/getIDProject/:id",

  projectController.getIdProject
);
router.put(
  "/updateProject/:id",

  projectController.putProject
);
router.delete(
  "/deleteProject/:id",

  projectController.deleteProject
);

router.post("/addTask", taskController.addTask);
router.get("/getTasks", taskController.getTasks);
router.get("/getIDTask/:id", taskController.getIdTask);
router.put("/updateTask/:id", taskController.putTask);
router.delete("/deleteTask/:id", taskController.deleteTask);

router.get("/verifyAccessToken", authController.verifyAccessToken);
router.post("/refreshToken", authController.refreshToken);
router.get("/getUsers", authController.getUsers);
router.get("/user", verifyAccessToken, authController.getInfoUser);
router.put("/updateUser", verifyAccessToken, authController.updateUser);

router.post("/addArea", areaController.addArea);
router.get("/getAreas", areaController.getAreas);
router.put("/updateArea/:id", areaController.putArea);
router.delete("/deleteArea/:id", areaController.deleteArea);

module.exports = router;
