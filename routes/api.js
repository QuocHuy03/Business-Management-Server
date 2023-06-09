const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");
const areaController = require("../controllers/areaController");
const verifyAccessToken = require("../middleware/verifyAcessToken");
const userController = require("../controllers/userController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.post("/addProject", verifyAccessToken, projectController.addProject);
router.get("/getProjects", verifyAccessToken, projectController.getProjects);
router.get(
  "/getIDProject/:id",
  verifyAccessToken,
  projectController.getIdProject
);
router.put(
  "/updateProject/:id",
  verifyAccessToken,
  projectController.putProject
);
router.delete(
  "/deleteProject/:id",
  verifyAccessToken,
  projectController.deleteProject
);

router.post("/addTask", verifyAccessToken, taskController.addTask);
router.get("/getTasks", verifyAccessToken, taskController.getTasks);
router.get("/getIDTask/:id", verifyAccessToken, taskController.getIdTask);
router.put("/updateTask/:id", verifyAccessToken, taskController.putTask);
router.delete("/deleteTask/:id", verifyAccessToken, taskController.deleteTask);

router.get("/verifyAccessToken", authController.verifyAccessToken);
router.post("/refreshToken", authController.refreshToken);
router.get("/getUsers", authController.getUsers);
router.get("/user", authController.getInfoUser);
router.put("/updateUser", verifyAccessToken, authController.updateUser);

router.post("/addArea", verifyAccessToken, areaController.addArea);
router.get("/getAreas", areaController.getAreas);
router.put("/updateArea/:id", verifyAccessToken, areaController.putArea);
router.delete("/deleteArea/:id", verifyAccessToken, areaController.deleteArea);


router.put("/updateUser/:id", verifyAccessToken, userController.updateUser);
router.get("/getUserId/:username", verifyAccessToken, userController.getUserId);
module.exports = router;
