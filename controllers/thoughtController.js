const { Thought, User } = require('../models');

const thoughtController = {
  // Obtener todos los pensamientos
  getAllThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Obtener un pensamiento por su ID
  getThoughtById: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.id);
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Crear un nuevo pensamiento
  createThought: async (req, res) => {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findById(req.body.userId);
      user.thoughts.push(thought._id);
      await user.save();
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Actualizar un pensamiento por su ID
  updateThought: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Eliminar un pensamiento por su ID
  deleteThought: async (req, res) => {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      const user = await User.findById(thought.userId);
      user.thoughts.pull(thought._id);
      await user.save();
      res.json({ message: 'Thought deleted successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Agregar una reacción a un pensamiento
  addReaction: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      thought.reactions.push(req.body);
      await thought.save();
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Eliminar una reacción de un pensamiento
  removeReaction: async (req, res) => {
    try {
      const thought = await Thought.findById(req.params.thoughtId);
      thought.reactions.pull({ reactionId: req.body.reactionId });
      await thought.save();
      res.json({ message: 'Reaction removed successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  }
};

module.exports = thoughtController;
