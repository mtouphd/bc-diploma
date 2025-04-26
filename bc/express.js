const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Chemin vers le dossier des identités
const walletPath = path.join(__dirname, 'wallet');
const ccpPath = path.resolve(__dirname, 'connection.json');

async function getContract() {
    try {
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        return network.getContract('diplomaContract');
    } catch (error) {
        console.error('Erreur de connexion à la blockchain:', error);
        throw new Error('Impossible de se connecter');
    }
}

// Endpoint pour soumettre une transaction
app.post('/submit', async (req, res) => {
    try {
        const { functionName, args } = req.body;
        const contract = await getContract();
        const result = await contract.submitTransaction(functionName, ...args);
        res.json({ success: true, result: result.toString() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Endpoint pour interroger la blockchain
app.post('/query', async (req, res) => {
    try {
        const { functionName, args } = req.body;
        const contract = await getContract();
        const result = await contract.evaluateTransaction(functionName, ...args);
        res.json({ success: true, result: result.toString() });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});
