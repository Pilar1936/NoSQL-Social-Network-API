const { User, Thought } = require('../models');

const userController = {
  // Obtener todos los usuarios
  async getAllUsers(_req, res) {
    try {
      const users = await User.find({})
        .populate({ 
          path: "friends", 
          select: "-__v" 
        })
        .select("-__v")
        .sort({ _id: -1 });

      res.json(users);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Obtener un usuario por su ID
  async getUserById(req, res) {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId })
            .populate({
                path: "thoughts",
                select: "-__v"
            })
            .populate({
                path: "friends",
                select: "-__v"
            })
            .select("-__v");
        
        if (!user) {
            return res.status(404).json({ message: 'No user was found with this ID!' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
},



  // POST a new user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      console.error("Error al crear usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Actualizar un usuario por su ID
  async updateUserById(req, res) {
    try {
      const userId = req.params.id;
      const updatedUserData = req.body;

      const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(updatedUser);
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  // Eliminar un usuario por su ID
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

  // Agregar un amigo a la lista de amigos de un usuario
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

  // Eliminar un amigo de la lista de amigos de un usuario
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

module.exports = userController;
