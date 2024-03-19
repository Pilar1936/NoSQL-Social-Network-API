const router = require("express").Router();

const { 
    getAllThoughts, 
    getThoughtById, 
    createThought, 
    updateThoughtById, 
    deleteThoughtById,
    createReaction, 
    deleteReactionById
} = require("../../controllers/thoughtController");

router.get('/', getAllThoughts);
router.get('/:id', getThoughtById);
router.post('/', createThought);
router.put('/:id', updateThoughtById);
router.delete('/:id', deleteThoughtById);
router.post('/:thoughtId/reactions', createReaction);
router.delete('/:thoughtId/reactions/:reactionId', deleteReactionById);

module.exports = router;
