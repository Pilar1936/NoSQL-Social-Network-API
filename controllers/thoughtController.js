const { Thought, User } = require("../models");

const thoughtController = {
  // GET all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate("reactions").sort({ createdAt: -1 });
      res.json(thoughts);
    } catch (err) {
      console.error("Error al obtener todos los pensamientos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // GET single thought by _id
  async getThoughtById(req, res) {
    try {
      const thoughtId = req.params.id;
      const thought = await Thought.findById(thoughtId).populate("reactions");
      if (!thought) {
        return res.status(404).json({ message: "Pensamiento no encontrado" });
      }
      res.json(thought);
    } catch (err) {
      console.error("Error al obtener pensamiento por ID:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // POST to create new thought
  async createThought(req, res) {
    try {
      const { thoughtText, username, userId } = req.body;
      const newThought = await Thought.create({ thoughtText, username });
      await User.findByIdAndUpdate(userId, { $push: { thoughts: newThought._id } });
      res.status(201).json(newThought);
    } catch (err) {
      console.error("Error al crear un nuevo pensamiento:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // PUT to update thought by _id
  async updateThoughtById(req, res) {
    try {
      const thoughtId = req.params.id;
      const { thoughtText } = req.body;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { thoughtText },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Pensamiento no encontrado" });
      }
      res.json(updatedThought);
    } catch (err) {
      console.error("Error al actualizar pensamiento por ID:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // DELETE to remove thought by _id
  async deleteThoughtById(req, res) {
    try {
      const thoughtId = req.params.id;
      const deletedThought = await Thought.findByIdAndDelete(thoughtId);
      if (!deletedThought) {
        return res.status(404).json({ message: "Pensamiento no encontrado" });
      }
      res.json({ message: "Pensamiento eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar pensamiento por ID:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // POST to create reaction
  async createReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const { reactionBody, username } = req.body;
      const newReaction = { reactionBody, username };
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $push: { reactions: newReaction } },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Pensamiento no encontrado" });
      }
      res.json(updatedThought);
    } catch (err) {
      console.error("Error al crear reacción:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // DELETE to pull and remove reaction by reaction's _id
  async deleteReactionById(req, res) {
    try {
      const { thoughtId, reactionId } = req.params;
      const updatedThought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $pull: { reactions: { _id: reactionId } } },
        { new: true }
      );
      if (!updatedThought) {
        return res.status(404).json({ message: "Pensamiento no encontrado" });
      }
      res.json({ message: "Reacción eliminada correctamente" });
    } catch (err) {
      console.error("Error al eliminar reacción por ID:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

module.exports = thoughtController;
