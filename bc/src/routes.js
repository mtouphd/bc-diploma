const express = require('express');
const router = express.Router();
const { connectToNetwork } = require('./fabricClient');
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { User } = require('./models'); // Assure-toi d'avoir un modèle User dans ton fichier 'models.js' ou un ORM comme Sequelize/Mongoose.



// 📌 Middleware de gestion des sessions
router.use(session({
    secret: 'ton_clé_secrète', // Une clé secrète pour signer la session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Si tu utilises HTTPS, mets `secure: true`
}));

// 📌 Inscription d'un utilisateur
router.post('/inscription', async (req, res) => {
    try {
        const { email, password, nom, role } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = await User.create({
            email,
            password: hashedPassword,
            nom,
            role, // Role de l'utilisateur (étudiant, enseignant, employeur, etc.)
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Connexion de l'utilisateur
router.post('/connexion', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Chercher l'utilisateur par email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé.' });
        }

        // Comparer le mot de passe avec celui en base de données
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect.' });
        }

        // Créer une session pour l'utilisateur
        req.session.userId = user.id;  // Enregistre l'ID de l'utilisateur dans la session
        req.session.role = user.role;  // Enregistre le rôle de l'utilisateur dans la session

        res.json({ message: 'Connexion réussie !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Profil de l'utilisateur (accessible uniquement si connecté)
router.get('/profil', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Utilisateur non connecté.' });
    }

    res.json({ userId: req.session.userId, role: req.session.role });
});

// 📌 Déconnexion de l'utilisateur
router.post('/deconnexion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
        }

        res.json({ message: 'Déconnexion réussie.' });
    });
});

// 📌 Exemple de route protégée (accessible uniquement si connecté)
router.get('/route-protegee', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Accès non autorisé.' });
    }

    // Code pour la route protégée
    res.json({ message: 'Accès autorisé à la route protégée.' });
});

module.exports = router;


// 📌 Soumettre une demande de diplôme (Étudiant)
router.post('/demande/soumettre', async (req, res) => {
    try {
        const { user, demandeId, nom, universite, annee, filiere } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('soumettreDemande', demandeId, nom, universite, annee, filiere, user);
        await gateway.disconnect();

        res.json({ message: 'Demande de diplôme soumise avec succès !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Valider une demande de diplôme (Enseignant uniquement)
router.post('/demande/valider', async (req, res) => {
    try {
        const { user, demandeId } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('validerDemande', demandeId);
        await gateway.disconnect();

        res.json({ message: 'Demande de diplôme validée avec succès !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Refuser une demande de diplôme (Enseignant uniquement)
router.post('/demande/refuser', async (req, res) => {
    try {
        const { user, demandeId, raison } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('refuserDemande', demandeId, raison);
        await gateway.disconnect();

        res.json({ message: 'Demande de diplôme refusée.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Transformer une demande validée en diplôme (Automatique après validation)
router.post('/diplome/generer', async (req, res) => {
    try {
        const { user, demandeId } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('genererDiplome', demandeId);
        await gateway.disconnect();

        res.json({ message: 'Diplôme généré avec succès !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// 📌 Liste des demandes de diplômes en attente (Enseignants uniquement)
router.get('/demandes', async (req, res) => {
    try {
        const { user } = req.query;
        const { contract, gateway } = await connectToNetwork(user);

        const result = await contract.evaluateTransaction('listeDemandes');
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Liste des diplômes enregistrés (Tout utilisateur)
router.get('/diplomes', async (req, res) => {
    try {
        const { user } = req.query;
        const { contract, gateway } = await connectToNetwork(user);

        const result = await contract.evaluateTransaction('listeDiplomes');
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Valider ou refuser une **promotion d’enseignant** (Jury uniquement)
router.post('/promotion/valider', async (req, res) => {
    try {
        const { user, enseignantId } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('validerPromotion', enseignantId);
        await gateway.disconnect();

        res.json({ message: 'Promotion validée avec succès !' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/promotion/refuser', async (req, res) => {
    try {
        const { user, enseignantId, raison } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('refuserPromotion', enseignantId, raison);
        await gateway.disconnect();

        res.json({ message: 'Promotion refusée.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
