const { expect } = require("chai");

describe("THXT contract", () => {
  let ThxtContract;
  let THXT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ThxtContract = await ethers.getContractFactory("THXT");
    THXT = await ThxtContract.deploy();
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
});
