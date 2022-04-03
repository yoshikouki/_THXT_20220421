import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("THXT contract", () => {
  let ThxtContractFactory: ContractFactory;
  let THXT: Contract;
  let owner: SignerWithAddress;
  let addressee: SignerWithAddress;

  beforeEach(async () => {
    [owner, addressee] = await ethers.getSigners();
    ThxtContractFactory = await ethers.getContractFactory("THXT");
    THXT = await ThxtContractFactory.deploy();
    await THXT.deployed();
  });

  describe("Deployment", () => {
    it("Should set the right name and symbol", async () => {
      expect(await THXT.name()).to.equal("Thanks Token");
      expect(await THXT.symbol()).to.equal("THXT");
    });

    it("Should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await THXT.balanceOf(owner.address);
      expect(await THXT.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Mint", () => {
    it("Should mint tokens", async () => {
      expect(await THXT.totalSupply()).to.equal(0);
      expect(await THXT.balanceOf(owner.address)).to.equal(0);
      const mint0Tx = await THXT.connect(owner).mint(owner.address);
      await mint0Tx.wait();
      expect(await THXT.totalSupply()).to.equal(1);
      expect(await THXT.balanceOf(owner.address)).to.equal(1);
      expect(await THXT.ownerOf(0)).to.equal(owner.address);
    });
  });
});
