import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.25",
        settings: {
            // Monad adalah EVM Cancun-compatible — mcopy opcode bisa dipakai di sini
            evmVersion: "cancun",
            optimizer: {
                enabled: true,
                runs: 200  // Dioptimalkan untuk deployment (bukan frekuensi panggilan)
            }
        }
    },
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
