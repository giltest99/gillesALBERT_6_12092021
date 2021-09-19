const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

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

/* 

router.post('/:id/like', auth, sauceCtrl.likeDislike); */


module.exports = router;