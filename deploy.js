const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'pen armor eagle casino require segment census craft duck toe piano level',  // dummy account mnemonic
    'https://rinkeby.infura.io/v3/fd5777f645f841ee95f94cf89b51426b'
);
const web3 = new Web3(provider);  // pass provider to instance of web3

// function is written only to let us use the async await syntax
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: ['Hi there!']
        })
        .send({
            gas: '1000000',
            gasPrice: '5000000000',
            from: accounts[0]
        });
        console.log('Contract deployed to', result.options.address)
};
deploy();