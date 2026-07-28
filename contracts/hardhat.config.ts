import * as dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const RPC_URL = process.env.MONAD_RPC_URL ?? "";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.25",
        settings: {
            evmVersion: "cancun",
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },

    paths: {
        sources: "./src",
    },

    networks: {
        monadTestnet: {
            url: RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
    },
};

export default config;
