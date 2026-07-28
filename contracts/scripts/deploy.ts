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

    const SmartDEX = await ethers.getContractFactory("SmartDEX");

    const smartDEX = await SmartDEX.deploy();

    await smartDEX.waitForDeployment();

    console.log("=================================");
    console.log("SmartDEX deployed!");
    console.log(await smartDEX.getAddress());
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});