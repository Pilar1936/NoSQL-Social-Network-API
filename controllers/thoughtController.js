\const { Thought, User } = require("../models");

const thoughtController = {
  // GET all thoughts
  async getAllThoughts(res) {
    try {
      const thoughts = await Thought.find().populate("reactions");
      res.json(thoughts);
    } catch (err) {
      console.error("Error al obtener todos los pensamientos:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // GET single thought by _id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).populate("reactions");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
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
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { runValidators: true, new: true }
      ).populate("thoughts");
      res.json(user);
    } catch (err) {
      console.error("Error al crear pensamiento:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // DELETE a user by ID
  async deleteUserById(req, res) {
    try {
      const userId = req.params.id;

      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Eliminar los pensamientos asociados al usuario eliminado
      await Thought.deleteMany({ user: userId });

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Add a friend to user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { friends: req.body.friendId } }, 
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No se encontró ningún usuario con ese ID' });
      }

      res.json(user);
    } catch (err) {
      console.error("Error al agregar amigo:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Remove a friend from user's friend list
  async removeFriend(req, res) {
    try {
      const userId = req.params.userId;
      const friendId = req.params.friendId;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      user.friends.pull(friendId);

      await user.save();

      res.json({ message: 'Amigo eliminado exitosamente' });
    } catch (err) {
      console.error("Error al eliminar amigo:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

module.exports = thoughtController;
