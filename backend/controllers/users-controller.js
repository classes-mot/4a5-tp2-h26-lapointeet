import jwt from "jsonwebtoken";
import HttpError from "../util/http-error.js";
import { User } from "../models/user.js";

const registerUser = async (req, res, next) => {
  const { name, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ name: name });
  } catch (err) {
    return next(new HttpError("Opération BD échouée", 500));
  }
  if (existingUser) {
    return next(new HttpError("Nom d'utilisateur déjà utilisé", 422));
  }
  const createdUser = new User({
    name,
    password,
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Enregistrement de l'utilisateur échoué", 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { name, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ name });
  } catch (err) {
    return next(new HttpError("Opération BD échouée", 500));
  }
  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError("Nom d'utilisateur ou mot de passe invalide", 401),
    );
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, name: existingUser.name },
      "supersecret_dont_share",
      { expiresIn: "1h" },
    );
  } catch (err) {
    return next(new HttpError("Échec de la génération du token", 500));
  }
  res.status(200).json({
    userId: existingUser.id,
    name: existingUser.name,
    token,
  });
};

export default {
  registerUser,
  loginUser,
};
