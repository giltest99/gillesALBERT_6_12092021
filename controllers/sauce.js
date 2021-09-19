const Sauce = require('../models/sauce');
const fs = require('fs');

// Create sauce
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then((sauce) => {
    res.status(201).json({ sauce });
  })
  .catch((error) => {
    res.status(400).json({
      error: error,
    });
  });
};

// Get all sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Get one sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Modify sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    // Delete image from ./images when sauce image is changed
    if (req.file) {
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => { res.status(200).json({ message: 'Sauce mise à jour!' }); })
              .catch((error) => { res.status(400).json({ error }); });
          })
        })
        .catch((error) => { res.status(500).json({ error }); 
      }); 
    } 
    else {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce mise à jour!' }))
        .catch((error) => res.status(400).json({ error }));
    }
};

// Delete sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// Like or dislike sauce
exports.likeDislike = (req, res, next) => {
  // Like sauce with default value == 0
  if (req.body.like === 1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then(() => res.status(200).json({ message: 'Sauce likée !' }))
          .catch(error => res.status(400).json({ error }))
  } 
  // Dislike sauce with default value == 0
  else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
          .catch(error => res.status(400).json({ error }))
  } 
  // Update usersLiked & usersDisliked arrays & set likes or dislikes to 0
  else {
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then(() => { res.status(200).json({ message: 'Like supprimé et user enlevé des likers !' }) })
                      .catch(error => res.status(400).json({ error }))
              } 
              else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then(() => { res.status(200).json({ message: 'Dislike supprimé et user enlevé des dislikers !' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}