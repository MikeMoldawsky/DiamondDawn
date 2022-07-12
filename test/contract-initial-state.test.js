chai = require('chai');
const Web3 = require('web3');
const { expect } = require("chai");
const { ethers } = require("hardhat");

chai.use(require('chai-bignumber')());

let diamondDawnContract;
let provider;
let owner, user1, user2, user3, user4;
let user5, user6, user7, user8;

// constants
const ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
const PAUSER_ROLE = "0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a";
const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
const ROYALTY_FEE_IN_BIPS = "1000"; // 10% royalty fee

beforeEach(async function () {
    const signers = await ethers.getSigners();
    provider = waffle.provider;
    owner = signers[0];
    user1 = signers[1];
    user2 = signers[2];
    user3 = signers[3];
    user4 = signers[4];
    user5 = signers[5];
    user6 = signers[6];
    user7 = signers[7];
    user8 = signers[8];

    const DiamondDawn = await ethers.getContractFactory("DiamondDawn");
    diamondDawnContract = await DiamondDawn.deploy(ROYALTY_FEE_IN_BIPS);

    await diamondDawnContract.deployed();
});

describe("When contract is deployed", () => {
    
    describe("State", () => {
        
        it("Should have a zero balance", async () => {
            // TODO: discover how to get contract balance
            // expect(await diamondDawnContract.getBalance()).to.be.bignumber.that.is.zero;
        });
        
        it("Should be paused", async () => {
            expect(await diamondDawnContract.paused()).to.equal(true);
        });

        it("Should not be with an active stage", async () => {
            expect(await diamondDawnContract.isStageActive()).to.equal(false);
        });

        it("Should not have stage set to mine", async () => {
            expect(await diamondDawnContract.stage()).to.equal(0);
        });

        it("Should have royalty fee set", async () => {
            // expect(diamondDawnContract.stage()).to.equal(0);
        });

        it("Should set the deployer as an admin", async () => {
            
            const isAdmin = await diamondDawnContract.hasRole(
                ADMIN_ROLE,
                owner.address
              );
            
            expect(isAdmin).to.equal(true);
        });

        it("Should set the deployer as an minter", async () => {
            
            const isMinter = await diamondDawnContract.hasRole(
                MINTER_ROLE,
                owner.address
              );
            
            expect(isMinter).to.equal(true);
        });

        it("Should set the deployer as an pauser", async () => {
            
            const isPauser = await diamondDawnContract.hasRole(
                PAUSER_ROLE,
                owner.address
              );
            
            expect(isPauser).to.equal(true);
        });

        it("Should have MINING_PRICE set to 0.2 eth", async () => {
            expect(await diamondDawnContract.MINING_PRICE()).equal(Web3.utils.toWei('0.2'));
        });

        it("Should have CUT_PRICE set to 0.4 eth", async () => {
            expect(await diamondDawnContract.CUT_PRICE()).equal(Web3.utils.toWei('0.4'));
        });

        it("Should have POLISH_PRICE set to 0.6 eth", async () => {
            expect(await diamondDawnContract.POLISH_PRICE()).equal(Web3.utils.toWei('0.6'));
        });

        it("Should have PREPAID_CUT_PRICE set to 0.2 eth", async () => {
            expect(await diamondDawnContract.PREPAID_CUT_PRICE()).equal(Web3.utils.toWei('0.2'))
        });

        it("Should have PREPAID_POLISH_PRICE set to 0.4 eth", async () => {
            expect(await diamondDawnContract.PREPAID_POLISH_PRICE()).equal(Web3.utils.toWei('0.4'));
        });
    });

    describe("Admin API", () => {
        
        describe("setRoyaltyInfo", () => { 

        });

        describe("pause", () => { 

        });

        describe("unpause", () => { 

        });
        
        describe("setProcessingPrice", () => { 

        });

        describe("revealStage", () => { 

        });

        describe("completeCurrentStage", () => { 

        });

        describe("addToAllowList", () => { 

        });

        describe("completeCurrentStage", () => { 

        });
    });

    describe("Client API", () => {

        describe("mine", () => { 

        });

        describe("cut", () => { 

        });

        describe("polish", () => { 

        });
        
        describe("burn", () => { 

        });

        describe("rebirth", () => { 

        });

        describe("tokenURI", () => { 

        });

        describe("addToAllowList", () => { 

        });

        describe("When stage is not active", () => { 
            
            describe("mine", () => { 

            });
    
            describe("cut", () => { 
    
            });
    
            describe("polish", () => { 
    
            });
            
            describe("burn", () => { 
    
            });
    
            describe("rebirth", () => { 
    
            });
    
            describe("tokenURI", () => { 
    
            });
    
            describe("addToAllowList", () => { 
    
            });
        });

        describe("When stage is active", () => { 
            
            describe("mine", () => { 

            });
    
            describe("cut", () => { 
    
            });
    
            describe("polish", () => { 
    
            });
            
            describe("burn", () => { 
    
            });
    
            describe("rebirth", () => { 
    
            });
    
            describe("tokenURI", () => { 
    
            });
    
            describe("addToAllowList", () => { 
    
            });
        });
    });
});