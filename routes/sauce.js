const express = require('express');
const router = express.Router();

// Import middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Import controller
const sauceCtrl = require('../controllers/sauce');

// Get all sauces
router.get('/', auth, sauceCtrl.getAllSauces);

// Create sauce
router.post('/', auth, multer, sauceCtrl.createSauce);

// Get one sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

// Modify sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// Delete sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Like or dislike sauce
router.post('/:id/like', auth, sauceCtrl.likeDislike);


module.exports = router;