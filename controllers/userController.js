const { User, Thought } = require('../models');

const userController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Obtener un usuario por su ID
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Crear un nuevo usuario
  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
  // Actualizar un usuario por su ID
  updateUser(req, res) {
    User.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: req.body
    }, {
        runValidators: true,
        new: true
    }).then((user) => {
        !user ? res.status(404).json({ message: 'No user' }) : res.json(user);

    }).catch((err) => res.status(500).json(err));


},
  // Eliminar un usuario por su ID
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.id }).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : Thought.deleteMany({
        _id: {
            $in: user.thoughts
        }
    })).then(() => res.json({ message: 'User deleted!' })).catch((err) => res.status(500).json(err));
},
  // Agregar un amigo a la lista de amigos de un usuario
  addFriend(req, res) {
    console.log('You are adding a friend');
    console.log(req.body);
    User.findOneAndUpdate({
        _id: req.params.id
    }, {
        $addToSet: {
            friends: req.params.friendsId
        }
    }, {
        runValidators: true,
        new: true
    }).then((user) => !user ? res.status(404).json({ message: 'No friend found with that ID :(' }) : res.json(user)).catch((err) => res.status(500).json(err));
},
  // Eliminar un amigo de la lista de amigos de un usuario
  removeFriend: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      user.friends.pull(req.params.friendId);
      await user.save();
      res.json({ message: 'Friend removed successfully' });
    } catch (err) {
      res.status(400).json(err);
    }
  }
};

module.exports = userController;
