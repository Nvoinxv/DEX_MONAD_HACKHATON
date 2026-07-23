// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SmartDEX.sol";

// Vault ini adalah tempat user menyimpan dananya.
// Nantinya Bot Engine (Server Node.js Anda) akan mengeksekusi trade secara otomatis
// menggunakan dana yang ada di sini jika kondisi strategi terpenuhi (misal: RSI < 30).
contract TradingBotVault is Ownable {
    // Alamat wallet bot yang diberi izin untuk mengeksekusi trade
    address public botExecutor;
    
    // Mapping untuk melacak saldo (balance) setiap user berdasarkan token
    // userAddress => tokenAddress => jumlah
    mapping(address => mapping(address => uint256)) public balances;

    // Event untuk melacak aktivitas di blockchain
    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event TradeExecuted(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    // Constructor, menjadikan deployer sebagai owner awal
    constructor() Ownable(msg.sender) {}

    // Fungsi untuk mengatur bot mana yang diizinkan mengeksekusi trade (Hanya bisa dipanggil Owner)
    function setBotExecutor(address _botExecutor) external onlyOwner {
        botExecutor = _botExecutor;
    }

    // Modifier keamanan: Hanya bot yang diizinkan yang boleh memanggil fungsi ini
    modifier onlyBot() {
        require(msg.sender == botExecutor, "Hanya bot yang diizinkan");
        _;
    }

    // Fungsi agar user bisa menyimpan dana (modal) mereka ke dalam Vault
    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Jumlah tidak boleh nol");
        
        // Pindahkan dana dari wallet user ke dalam kontrak Vault ini
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Catat saldo user
        balances[msg.sender][token] += amount;
        emit Deposited(msg.sender, token, amount);
    }

    // Fungsi agar user bisa menarik kembali dana mereka kapan saja (Non-Custodial)
    function withdraw(address token, uint256 amount) external {
        require(balances[msg.sender][token] >= amount, "Saldo tidak cukup");
        
        // Kurangi saldo user terlebih dahulu untuk mencegah re-entrancy attack
        balances[msg.sender][token] -= amount;
        
        // Kembalikan dana ke wallet user
        IERC20(token).transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, token, amount);
    }

    // Fungsi utama untuk mengeksekusi strategi (Dipanggil secara otomatis oleh BOT backend)
    function executeTrade(
        address user, 
        address dexAddress, 
        address tokenIn, 
        address tokenOut, 
        uint256 amountIn
    ) external onlyBot {
        // Pastikan user punya dana yang cukup untuk di-trade
        require(balances[user][tokenIn] >= amountIn, "Saldo user tidak cukup untuk trade");

        // Kurangi saldo tokenIn user
        balances[user][tokenIn] -= amountIn;

        // Berikan izin (Approve) kepada SmartDEX untuk memotong dana dari Vault ini
        IERC20(tokenIn).approve(dexAddress, amountIn);

        // Lakukan swap di SmartDEX (Kontrak berinteraksi dengan Kontrak lain)
        SmartDEX dex = SmartDEX(dexAddress);
        uint256 amountOut = dex.swap(tokenIn, amountIn);

        // Tambahkan hasil trade (tokenOut) ke saldo user
        balances[user][tokenOut] += amountOut;

        // Pancarkan event bahwa trade berhasil dieksekusi oleh bot
        emit TradeExecuted(user, tokenIn, tokenOut, amountIn, amountOut);
    }
}
