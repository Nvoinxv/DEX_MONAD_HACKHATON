import { ethers } from "hardhat";

async function main() {
    console.log("Deploying contract...");

    const [deployer] = await ethers.getSigners();

    console.log("Wallet :", deployer.address);
    console.log(
        "Balance:",
        ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
        "MON"
    );

    // 1. Deploy Token0 (Mock MON)
    const Token = await ethers.getContractFactory("MonadToken");
    console.log("Deploying Token0 (Mock MON)...");
    const token0 = await Token.deploy("Mock MON", "MON", 1000000, 10000000, deployer.address);
    await token0.waitForDeployment();
    const token0Address = await token0.getAddress();
    console.log("Token0 deployed to:", token0Address);

    // 2. Deploy Token1 (Mock USDC)
    console.log("Deploying Token1 (Mock USDC)...");
    const token1 = await Token.deploy("Mock USDC", "USDC", 1000000, 10000000, deployer.address);
    await token1.waitForDeployment();
    const token1Address = await token1.getAddress();
    console.log("Token1 deployed to:", token1Address);

    // 3. Deploy SmartDEX
    console.log("Deploying SmartDEX...");
    const SmartDEX = await ethers.getContractFactory("SmartDEX");
    
    // Pass token0 and token1 addresses to SmartDEX constructor
    const smartDEX = await SmartDEX.deploy(token0Address, token1Address);
    await smartDEX.waitForDeployment();

    console.log("=================================");
    console.log("✅ SmartDEX deployed!");
    console.log("Contract Address:", await smartDEX.getAddress());
    console.log("Token0 (MON) Address:", token0Address);
    console.log("Token1 (USDC) Address:", token1Address);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});