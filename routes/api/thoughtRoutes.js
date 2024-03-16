const router = require("express").Router();

const { getAllThoughts, 
    getThoughtById, 
    createThought, 
    updateThoughtById, 
    deleteThoughtById,
    createReaction, 
    deleteReactionById} = require("../../controllers/thoughtController");

    router.get('/thoughts', getAllThoughts);
    router.get('/thoughts/:id', getThoughtById);
    router.post('/thoughts', createThought);
    router.put('/thoughts/:id', updateThoughtById);
    router.delete('/thoughts/:id', deleteThoughtById);
    router.post('/thoughts/:thoughtId/reactions', createReaction);
    router.delete('/thoughts/:thoughtId/reactions/:reactionId', deleteReactionById);


module.exports = router;