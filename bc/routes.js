const express = require('express');
const router = express.Router();
const { connectToNetwork } = require('./fabricClient');

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

// 📌 Vérifier un diplôme (Employeur, Enseignant, Étudiant)
router.get('/diplome/:diplomeId', async (req, res) => {
    try {
        const { user } = req.query;
        const { diplomeId } = req.params;
        const { contract, gateway } = await connectToNetwork(user);

        const result = await contract.evaluateTransaction('verifierDiplome', diplomeId);
        await gateway.disconnect();

        res.json(JSON.parse(result.toString()));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Révoquer un diplôme (Enseignant uniquement)
router.post('/diplome/revoquer', async (req, res) => {
    try {
        const { user, diplomeId } = req.body;
        const { contract, gateway } = await connectToNetwork(user);

        await contract.submitTransaction('revoquerDiplome', diplomeId);
        await gateway.disconnect();

        res.json({ message: 'Diplôme révoqué avec succès !' });
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
