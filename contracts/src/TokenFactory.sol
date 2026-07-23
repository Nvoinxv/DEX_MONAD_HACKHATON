// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Ini adalah standar Token Monad (berbasis ERC20)
// Karena Monad kompatibel dengan EVM, kode ERC20 adalah cara standar membuat token di Monad.
contract MonadToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address creator
    ) ERC20(name, symbol) Ownable(creator) {
        // Mencetak token awal dan mengirimkannya ke pembuat (creator)
        _mint(creator, initialSupply * 10 ** decimals());
    }
}

// TokenFactory memungkinkan user membuat token mereka sendiri dengan 1-Klik
contract TokenFactory {
    // Array untuk menyimpan semua alamat token yang pernah dibuat
    address[] public deployedTokens;
    
    // Event yang akan dipancarkan (emit) ketika token baru berhasil dibuat
    event TokenCreated(address indexed tokenAddress, string name, string symbol, uint256 initialSupply, address indexed creator);

    /**
     * @dev Fungsi untuk membuat token baru.
     * @param name Nama dari token (contoh: Nvoin Coin)
     * @param symbol Simbol token (contoh: NVN)
     * @param initialSupply Jumlah pasokan koin awal
     */
    function createToken(string memory name, string memory symbol, uint256 initialSupply) external returns (address) {
        // Membuat instance MonadToken baru. 
        // msg.sender adalah user yang memanggil fungsi ini.
        MonadToken newToken = new MonadToken(name, symbol, initialSupply, msg.sender);
        
        // Menyimpan alamat token baru ke dalam daftar
        deployedTokens.push(address(newToken));
        
        // Memberikan notifikasi bahwa token berhasil dibuat
        emit TokenCreated(address(newToken), name, symbol, initialSupply, msg.sender);
        
        return address(newToken);
    }

    /**
     * @dev Mengembalikan jumlah total token yang telah dibuat melalui factory ini
     */
    function getDeployedTokensCount() external view returns (uint256) {
        return deployedTokens.length;
    }
}
