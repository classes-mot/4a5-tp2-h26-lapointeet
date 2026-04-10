import { validationResult } from "express-validator";
import HttpError from "../util/http-error.js";
import { Jeu } from "../models/jeu.js";
import { User } from "../models/user.js";

const createJeu = async (req, res, next) => {
  const userId = req.userData.userId;
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("Données saisies invalides, vérifier votre payload"),
    );
  }
  const { nom, categorie, joueurs, duree } = req.body;
  const createdJeu = new Jeu({
    nom,
    categorie,
    joueurs,
    duree,
    assignee: userId,
  });
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError("Opération BD échouée", 500));
  }
  if (!user) {
    return next(new HttpError("Utilisateur non trouvé", 404));
  }
  try {
    await createdJeu.save();
    user.jeux.push(createdJeu);
    await user.save();
  } catch (err) {
    return next(new HttpError("Ajout dans la BD échoué", 500));
  }
  res.status(201).json({ jeu: createdJeu.toObject({ getters: true }) });
};

const getJeux = async (req, res, next) => {
  let jeux;
  try {
    jeux = await Jeu.find().populate("assignee", "-password");
  } catch (err) {
    return next(new HttpError("Opération BD échouée", 500));
  }
  res.json({ jeux: jeux.map((jeu) => jeu.toObject({ getters: true })) });
};

const getJeuById = async (req, res, next) => {
  const jeuId = req.params.id;
  let jeu;
  try {
    jeu = await Jeu.findById(jeuId);
  } catch (err) {
    return next(new HttpError("Opération BD échouée", 500));
  }
  if (!jeu) {
    return next(new HttpError("Jeu non trouvé", 404));
  }
  res.json({ jeu: jeu.toObject({ getters: true }) });
};

const updateJeu = async (req, res, next) => {
  const jeuUpdates = req.body;
  const jeuId = req.params.id;
  try {
    const updatedJeu = await Jeu.findByIdAndUpdate(jeuId, jeuUpdates, {
      new: true,
    });
    if (!updatedJeu) {
      return next(new HttpError("Jeu non trouvé", 404));
    }
    res.status(200).json({ jeu: updatedJeu.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError("Mise à jour du jeu échouée", 500));
  }
};

const deleteJeu = async (req, res, next) => {
  const jeuId = req.params.id;
  try {
    const jeu = await Jeu.findById(jeuId).populate("assignee");
    if (!jeu) {
      return next(new HttpError("Jeu non trouvé", 404));
    }
    await jeu.deleteOne();
    jeu.assignee.jeux.pull(jeu._id);
    await jeu.assignee.save();
    res.status(200).json({ message: "Jeu supprimé avec succès" });
  } catch (err) {
    return next(new HttpError("Suppression du jeu échouée", 500));
  }
};

export default {
  createJeu,
  getJeux,
  getJeuById,
  updateJeu,
  deleteJeu,
};
