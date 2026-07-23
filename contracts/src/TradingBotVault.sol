// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Interface sederhana agar Vault bisa memanggil fungsi swap di SmartDEX
interface ISmartDEX {
    function swap(address _tokenIn, uint256 _amountIn) external returns (uint256 amountOut);
}

/**
 * @title TradingBotVault
 * @dev Kontrak tempat user menyimpan dana untuk di-trading-kan secara otomatis.
 * Hanya dompet bot terotorisasi yang dapat mengeksekusi trade.
 * Bot HANYA BISA melakukan trade, tidak bisa menarik (withdraw) dana user.
 */
contract TradingBotVault is Ownable, ReentrancyGuard {
    // Mapping untuk melacak saldo setiap user berdasarkan token
    // alamat_user => alamat_token => saldo
    mapping(address => mapping(address => uint256)) public balances;
    
    // Alamat bot backend yang diizinkan untuk memicu trade
    address public authorizedBot;

    // Alamat dari SmartDEX yang kita gunakan
    address public dexAddress;

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount);
    event TradeExecuted(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    event BotUpdated(address oldBot, address newBot);

    // Modifier khusus: memastikan yang memanggil hanya si Bot
    modifier onlyBot() {
        require(msg.sender == authorizedBot, "Hanya bot yang diizinkan");
        _;
    }

    // Me-assign alamat pembuat sebagai owner saat deployment
    constructor(address _dexAddress, address _authorizedBot) Ownable(msg.sender) {
        dexAddress = _dexAddress;
        authorizedBot = _authorizedBot;
    }

    /**
     * @dev Owner (Admin) bisa mengubah alamat bot sewaktu-waktu
     */
    function setAuthorizedBot(address _newBot) external onlyOwner {
        address oldBot = authorizedBot;
        authorizedBot = _newBot;
        emit BotUpdated(oldBot, _newBot);
    }

    /**
     * @dev User memanggil ini untuk menyetor dana mereka ke dalam Vault.
     */
    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount harus lebih dari 0");
        
        // Pindahkan token dari user ke dalam kontrak Vault ini
        // PASTIKAN user sudah memanggil `approve` di kontrak token sebelumnya!
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        
        // Catat saldo user
        balances[msg.sender][token] += amount;
        
        emit Deposited(msg.sender, token, amount);
    }

    /**
     * @dev User bisa menarik kembali dana mereka kapan saja. Bot tidak punya akses ini.
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(balances[msg.sender][token] >= amount, "Saldo tidak mencukupi");
        
        // Kurangi catatan saldo
        balances[msg.sender][token] -= amount;
        
        // Kirimkan token kembali ke user
        IERC20(token).transfer(msg.sender, amount);
        
        emit Withdrawn(msg.sender, token, amount);
    }

    /**
     * @dev Fungsi inti untuk otomatisasi.
     * Bot backend mendeteksi kondisi strategi (misal RSI < 30) lalu memanggil fungsi ini
     * untuk menukar token milik user tertentu di SmartDEX.
     * 
     * @param userTarget Alamat user yang strateginya tereksekusi
     * @param tokenIn Token yang akan dijual dari saldo user
     * @param tokenOut Token yang diharapkan untuk dibeli
     * @param amountIn Jumlah yang dijual
     */
    function executeTrade(
        address userTarget,
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external onlyBot nonReentrant {
        // 1. Pastikan user punya saldo cukup di Vault
        require(balances[userTarget][tokenIn] >= amountIn, "Saldo user tidak cukup untuk trade");

        // 2. Kurangi saldo tokenIn milik user
        balances[userTarget][tokenIn] -= amountIn;

        // 3. Izinkan DEX untuk menarik token dari Vault ini sejumlah amountIn
        IERC20(tokenIn).approve(dexAddress, amountIn);

        // 4. Eksekusi swap di SmartDEX
        // DEX akan mengambil tokenIn dari Vault dan mengembalikan tokenOut ke Vault
        uint256 amountOut = ISmartDEX(dexAddress).swap(tokenIn, amountIn);

        // 5. Tambahkan saldo tokenOut untuk si user
        balances[userTarget][tokenOut] += amountOut;

        emit TradeExecuted(userTarget, tokenIn, tokenOut, amountIn, amountOut);
    }
}
