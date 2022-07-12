const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("When contract is in polish stage and stage is active", () => {
    
    describe("State", () => {
        
        it("Should have a zero balance", async () => {

        });
        
        it("Should be paused", async () => {

        });

        it("Should not be with an active stage", async () => {

        });

        it("Should not have stage set to mine", async () => {

        });

        it("Should have royalty fee set", async () => {

        });

        it("Should have the deployer as an admin", async () => {

        });

        it("Should have MINING_PRICE set to 0.2 eth", async () => {

        });

        it("Should have CUT_PRICE set to 0.4 eth", async () => {

        });

        it("Should have POLISH_PRICE set to 0.6 eth", async () => {

        });

        it("Should have PREPAID_CUT_PRICE set to 0.2 eth", async () => {

        });

        it("Should have PREPAID_POLISH_PRICE set to 0.4 eth", async () => {

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