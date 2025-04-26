const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const ccpPath = path.resolve(__dirname, 'network', 'connection-org1.json'); 
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function connectToNetwork(user) {
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet, identity: user, discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('diplomeContract'); 
    return { contract, gateway };
}

module.exports = { connectToNetwork };
