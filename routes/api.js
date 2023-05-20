const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const projectController = require("../controllers/projectController");

router.post("/register", authController.register);
router.post("/login", authController.login);


router.post("/addProject", projectController.addProject);
router.get("/getProjects", projectController.getProjects);
router.get("/getIDProject/:id", projectController.getIdProject);
router.put("/updateProject/:id", projectController.putProject);
module.exports = router;
