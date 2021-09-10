const assert = require('assert');  // used for testing
const ganache = require('ganache-cli');  // can make use of Ganaches unlocked accounts (no keys needed)
const Web3 = require('web3');  // capitalize web3 because we are making use of constructor function which is used to make instances of web3 library
const web3 = new Web3(ganache.provider());  // working with an instance of Web3 (lowercase)
const { interface, bytecode } = require('../compile');  // import the bytecode and ABI from compile.js

let accounts;  // list of unlocked accounts
let inbox;     
const INITIAL_STRING = 'Hi there!'

// must mark the function its contained in as async 
beforeEach(async () => {
    // Get a list of all UNLOCKED acounts using instance of web3
    accounts = await web3.eth.getAccounts() // use await for async calls (almost all)
        
    // Use one of those accounts to deploy the contract
    // JSON.parse gives back a javascript object for the contract
    // await says wait for this to be deployed successfully its asynchronous

    // inbox is the javascript representation of the contract, we can call functions on it and interact with the contract thats on the blockchain
    inbox = await new web3.eth.Contract(JSON.parse(interface))  // contract is a constructor - create new contract
        .deploy({                                               // deploy creates a transaction object. arg is a list - deploy contract and send to network
            data: bytecode, 
            arguments: ['Hi there!'] 
        })  
        .send({ 
            from: accounts[0], 
            gas: '1000000' })  
        });

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    // only calling a function requires no gas (does not modify the contracts data)
    it('it has a default message', async () => {
        const message = await inbox.methods.message().call();  // message() takes method arguments and call() customizes transaction 
        assert.equal(message, 'Hi there!')
    });

    // Modifys the contracts data so it must be sent using send() and gas and whos paying
    it('Properly sets message', async () => {
        await inbox.methods.setMessage('Bye there!').send({from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Bye there!');
    });
}); 



