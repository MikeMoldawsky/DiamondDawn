/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require("dotenv").config();
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = ethers;

describe("DiamondDawnMine", () => {

    async function deployDiamondDawnMineFixture() {
        const DiamondDawnMine = await ethers.getContractFactory("DiamondDawnMine");
        const diamondDawnMine = await DiamondDawnMine.deploy();
        await diamondDawnMine.deployed();

        return { diamondDawnMine };
    }

    async function populateDiamondStubs(diamondDawnMine) {
        await diamondDawnMine.populateDiamonds([
            [ 1658748130, 1, "1 x 2 x 3", "Heart", "0.1", "Excellent", "Excellent", "Excellent", "Excellent", "Excellent", "None" ]//,
            [ 1658748130, 2, "1 x 2 x 3", "Oval", "0.2", "Excellent", "Excellent", "Excellent", "Excellent", "Excellent", "None" ]
        ]);
    }

    describe("Transactions", () => {
        
        xit("Should add a diamond to unassigned diamonds list", async () => {
            const { diamondDawnMine } = await loadFixture(deployDiamondDawnMineFixture);

            await populateDiamondStubs(diamondDawnMine);
        });
    });

    describe("Read API", () => {

        xit ("Should return the correct JSON for a diamond", async () => {
            const { diamondDawnMine } = await loadFixture(deployDiamondDawnMineFixture);
            
            await populateDiamondStubs(diamondDawnMine);
            await diamondDawnMine.allocateDiamond();

            let _diamondId;

            diamondDawnMine.on("DiamondAllocated", async (diamondId) => {
                // _diamondId = diamondId;
                console.log("Diamond allocated: " + diamondId);
            });

            let diamondJson = await diamondDawnMine.getDiamondMetadata(1, 1, 0, "http://www.gal.com");
            console.log(diamondJson);
            diamondJson = await diamondDawnMine.getDiamondMetadata(2, 2, 0, "http://www.gal.com");
            console.log(diamondJson);
        });
    });
})