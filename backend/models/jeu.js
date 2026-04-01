import mongoose from "mongoose";

const jeuSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  categorie: { type: String, required: true },
  joueurs: { type: Number, required: true },
  duree: { type: Number, required: true },
  assignee: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Jeu = mongoose.model("Jeu", jeuSchema);
