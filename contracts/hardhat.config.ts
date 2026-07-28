import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from the root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Try to get PRIVATE_KEY, if user put it as PRIVATE_KEY_HERE, we use that too
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.env.PRIVATE_KEY_HERE || "";

// Default to Monad Testnet public RPC if not set in .env
const RPC_URL = process.env.MONAD_RPC_URL || "https://testnet-rpc.monad.xyz/";


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
