import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("THXT contract", () => {
  let ThxtContractFactory: ContractFactory;
  let THXT: Contract;
  let owner: SignerWithAddress;
  let addressee: SignerWithAddress;
  let nonowner: SignerWithAddress;

  beforeEach(async () => {
    [owner, addressee, nonowner] = await ethers.getSigners();
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

    it("Should fail to mint with who has not minter role", async () => {
      await expect(THXT.connect(nonowner).mint(addressee.address)).to
        .revertedWith(
          "ERC721PresetMinterPauserAutoId: must have minter role to mint",
        );
    });
  });

  describe("Transfer", () => {
    let tokenId: number;
    beforeEach(async () => {
      const mint1Tx = await THXT.connect(owner).mint(owner.address);
      await mint1Tx.wait();
      tokenId = await THXT.totalSupply() - 1;
    });

    it("Should transfer tokens between accounts", async () => {
      expect(await THXT.balanceOf(owner.address)).to.equal(1);
      expect(await THXT.balanceOf(addressee.address)).to.equal(0);
      const transfer = await THXT.connect(owner).transferFrom(
        owner.address,
        addressee.address,
        tokenId,
      );
      await transfer.wait();
      expect(await THXT.balanceOf(owner.address)).to.equal(0);
      expect(await THXT.balanceOf(addressee.address)).to.equal(1);
    });
  });

  describe("Burn", () => {
    let tokenId: number;
    beforeEach(async () => {
      const mint1Tx = await THXT.connect(owner).mint(owner.address);
      await mint1Tx.wait();
      tokenId = await THXT.totalSupply() - 1;
    });

    it("Should burn token", async () => {
      const initialTotalSupply = await THXT.totalSupply();
      const initialOwnerSupply = await THXT.balanceOf(owner.address);
      const burnTHXT = await THXT.burn(tokenId);
      await burnTHXT.wait();
      expect(await THXT.totalSupply()).to
        .equal(initialTotalSupply - 1);
      expect(await THXT.balanceOf(owner.address)).to
        .equal(initialOwnerSupply - 1);
      expect(THXT.ownerOf(tokenId)).to
        .revertedWith("ERC721: owner query for nonexistent token");
      expect(THXT.tokenURI(tokenId)).to
        .revertedWith("ERC721Metadata: URI query for nonexistent token");
    });
  });
});
