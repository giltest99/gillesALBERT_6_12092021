const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');

const app = express();

// Connect to mongoDb
mongoose.connect('mongodb+srv://bdd_1:GpY2Pkp5T8UAaaw@cluster0.qyqdx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  // CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

// Route to login & signup
app.use('/api/auth', userRoutes);

// Static files
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;