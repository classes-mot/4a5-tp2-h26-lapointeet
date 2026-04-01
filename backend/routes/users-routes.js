import express from "express";
import userController from "../controllers/users-controller.js";

const router = express.Router();

router.get("/", userController.getUsers);

router.get("/:id", userController.getUserById);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.patch("/:id", userController.updateUser);

export default router;
