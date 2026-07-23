import { expect } from "chai";
import { ethers } from "hardhat";

describe("Nvoin SmartDEX Protocol", function () {
  let owner: any;
  let bot: any;
  let user: any;
  let tokenFactory: any;
  let smartDex: any;
  let vault: any;
  
  // Dummy tokens
  let tokenA: any;
  let tokenB: any;

  beforeEach(async function () {
    [owner, bot, user] = await ethers.getSigners();

    // 1. Deploy TokenFactory
    const TokenFactory = await ethers.getContractFactory("TokenFactory");
    tokenFactory = await TokenFactory.deploy();
    await tokenFactory.waitForDeployment();

    // Buat 2 test token (TokenA dan TokenB)
    await tokenFactory.createToken("Monad Token", "MONAD", 1000000);
    await tokenFactory.createToken("Tether", "USDT", 1000000);
    
    const tokenAAddress = await tokenFactory.allTokens(0);
    const tokenBAddress = await tokenFactory.allTokens(1);
    
    tokenA = await ethers.getContractAt("MonadToken", tokenAAddress);
    tokenB = await ethers.getContractAt("MonadToken", tokenBAddress);

    // 2. Deploy SmartDEX dengan pasangan TokenA & TokenB
    const SmartDEX = await ethers.getContractFactory("SmartDEX");
    smartDex = await SmartDEX.deploy(tokenAAddress, tokenBAddress);
    await smartDex.waitForDeployment();

    // Owner menambahkan modal (likuiditas) awal ke DEX
    await tokenA.approve(smartDex.target, 100000);
    await tokenB.approve(smartDex.target, 100000);
    await smartDex.addLiquidity(100000, 100000);

    // 3. Deploy TradingBotVault
    const Vault = await ethers.getContractFactory("TradingBotVault");
    vault = await Vault.deploy();
    await vault.waitForDeployment();
    
    // Memberikan izin kepada 'bot' wallet untuk mengeksekusi trade
    await vault.setBotExecutor(bot.address);
    
    // Berikan sedikit token ke user untuk keperluan testing
    await tokenA.transfer(user.address, 10000);
  });

  it("Harus mengizinkan user untuk Deposit dan Withdraw dari Vault", async function () {
    // User approve dan deposit 1000 TokenA
    await tokenA.connect(user).approve(vault.target, 1000);
    await vault.connect(user).deposit(tokenA.target, 1000);
    
    expect(await vault.balances(user.address, tokenA.target)).to.equal(1000);
    
    // User withdraw 500 TokenA
    await vault.connect(user).withdraw(tokenA.target, 500);
    expect(await vault.balances(user.address, tokenA.target)).to.equal(500);
  });

  it("Harus mengizinkan BOT untuk mengeksekusi trade secara otomatis", async function () {
    // User deposit 1000 TokenA
    await tokenA.connect(user).approve(vault.target, 1000);
    await vault.connect(user).deposit(tokenA.target, 1000);

    // BOT mengeksekusi swap (500 TokenA -> TokenB) atas nama user
    await vault.connect(bot).executeTrade(
      user.address, 
      smartDex.target, 
      tokenA.target, 
      tokenB.target, 
      500
    );

    // Saldo TokenA user berkurang
    expect(await vault.balances(user.address, tokenA.target)).to.equal(500);
    
    // Saldo TokenB user bertambah (dari hasil swap di DEX)
    const tokenBBalance = await vault.balances(user.address, tokenB.target);
    expect(tokenBBalance).to.be.gt(0); 
  });

  it("Harus menolak (revert) jika selain BOT mencoba eksekusi trade", async function () {
    await tokenA.connect(user).approve(vault.target, 1000);
    await vault.connect(user).deposit(tokenA.target, 1000);

    // User biasa (bukan bot) mencoba eksekusi trade, harus gagal
    await expect(
      vault.connect(user).executeTrade(user.address, smartDex.target, tokenA.target, tokenB.target, 500)
    ).to.be.revertedWith("Hanya bot yang diizinkan");
  });
});
