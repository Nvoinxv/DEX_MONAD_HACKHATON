import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  paths: {
    sources: "./src"
  },
  networks: {
    // Untuk Hackathon Monad, Anda bisa menambahkan config testnet Monad di sini nanti
    // monadTestnet: {
    //   url: "RPC_URL_HERE",
    //   accounts: ["PRIVATE_KEY_HERE"]
    // }
  }
};

export default config;
