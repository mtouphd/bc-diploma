const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes'); // Importation des routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes); // Utilisation des routes

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
