const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    addFriend,
    removeFriend
} = require('../../controllers/userController');

// Rutas para usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUserById);
router.post('/users/:id/friends', addFriend);
router.delete('/users/:userId/friends/:friendId', removeFriend);

module.exports = router;