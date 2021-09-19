require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const mongoose = require('mongoose');
const path = require('path');

//Import des routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());

// Connect to mongoDb
mongoose.connect(process.env.DB_CONNECT,
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

// Middlewares, app
app.use(helmet());

app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Static files
app.use('/images', express.static(path.join(__dirname, 'images')));
        


module.exports = app;