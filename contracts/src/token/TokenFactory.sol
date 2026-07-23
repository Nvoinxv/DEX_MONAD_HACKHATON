// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Meskipun ini di jaringan Monad, standar pembuatan token tetap mengikuti interface ERC20
// Ini karena Monad 100% EVM Compatible. Token asli (seperti ETH) adalah MONAD,
// tetapi token-token yang dibuat oleh user di atas jaringan Monad berformat ERC20.
contract MonadToken is ERC20, Ownable {
    // Constructor untuk inisialisasi token baru
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address creator
    )
        ERC20(name, symbol)
        Ownable(creator) // Menjadikan pembuat token sebagai owner
    {
        // Mencetak token dan mengirimkannya ke wallet pembuat (creator)
        _mint(creator, initialSupply * 10 ** decimals());
    }
}

contract TokenFactory {
    // Event yang akan dicatat di blockchain setiap kali token baru dibuat
    // Berguna agar frontend (Next.js) bisa melacak token baru
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address indexed creator
    );

    // Menyimpan daftar semua token yang pernah dibuat melalui pabrik (factory) ini
    address[] public allTokens;

    // Fungsi utama untuk mencetak token baru dengan satu klik (One-Click Deploy)
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) external returns (address) {
        // Membuat kontrak MonadToken baru
        MonadToken newToken = new MonadToken(
            name,
            symbol,
            initialSupply,
            msg.sender
        );

        // Menyimpan alamat kontrak token yang baru ke dalam daftar
        allTokens.push(address(newToken));

        // Memancarkan event agar bisa dideteksi oleh backend/frontend
        emit TokenCreated(address(newToken), name, symbol, msg.sender);

        return address(newToken);
    }

    // Fungsi untuk mendapatkan total token yang pernah dibuat
    function getTotalTokens() external view returns (uint256) {
        return allTokens.length;
    }
}
