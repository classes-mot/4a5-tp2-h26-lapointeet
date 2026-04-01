import express from "express";
import { check } from "express-validator";
import jeuxController from "../controllers/jeux-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", jeuxController.getJeux);

router.get("/:id", jeuxController.getJeuById);

router.get("/:id", jeuxController.getJeuxByUserId);

router.use(checkAuth);

router.post(
  "/",
  [
    check("nom").not().isEmpty(),
    check("categorie").not().isEmpty(),
    check("joueurs").isInt({ min: 1 }),
    check("duree").isInt({ min: 1 }),
    checkAuth,
  ],
  jeuxController.createJeu,
);

router.patch("/:id", jeuxController.updateJeu);

router.delete("/:id", jeuxController.deleteJeu);

export default router;
