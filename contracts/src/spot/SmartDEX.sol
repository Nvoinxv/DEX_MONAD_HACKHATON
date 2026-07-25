// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Ini adalah implementasi dasar Automated Market Maker (AMM) dengan rumus x * y = k.
// Sangat cocok untuk hackathon sebagai simulasi pertukaran (swap) token di Monad.
contract SmartDEX is ReentrancyGuard {
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    // Cadangan (reserve) token yang ada di dalam pool DEX
    uint256 public reserve0;
    uint256 public reserve1;

    // Constructor untuk menentukan pasangan token apa yang akan diperdagangkan
    // Misalnya: MONAD (sebagai wMONAD ERC20) dan USDT
    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    // Fungsi untuk menambahkan likuiditas (modal) ke dalam DEX
    function addLiquidity(
        uint256 amount0,
        uint256 amount1
    ) external returns (uint256 shares) {
        // Transfer token dari user ke smart contract DEX
        token0.transferFrom(msg.sender, address(this), amount0);
        token1.transferFrom(msg.sender, address(this), amount1);

        // Update jumlah cadangan (reserves)
        reserve0 += amount0;
        reserve1 += amount1;

        // (Untuk versi sederhana ini, kita belum mengimplementasikan LP Token yang kompleks)
        return amount0 + amount1;
    }

    // Fungsi inti: Menukar token menggunakan rumus konstan x * y = k
    function swap(
        address _tokenIn,
        uint256 _amountIn
    ) external nonReentrant returns (uint256 amountOut) {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "Token tidak didukung"
        );
        require(_amountIn > 0, "Jumlah harus lebih dari 0");

        bool isToken0 = _tokenIn == address(token0);

        // Tentukan token apa yang masuk dan token apa yang keluar
        (
            IERC20 tokenIn,
            IERC20 tokenOut,
            uint256 reserveIn,
            uint256 reserveOut
        ) = isToken0
                ? (token0, token1, reserve0, reserve1)
                : (token1, token0, reserve1, reserve0);

        // Transfer token input dari user ke DEX
        tokenIn.transferFrom(msg.sender, address(this), _amountIn);

        // Menghitung jumlah token output menggunakan rumus x * y = k
        // Kita juga menambahkan fee 0.3% untuk Liquidity Provider (997 / 1000)
        uint256 amountInWithFee = _amountIn * 997;
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        amountOut = numerator / denominator;

        require(amountOut > 0, "Output terlalu kecil (Slippage)");

        // Update cadangan DEX (Reserves)
        if (isToken0) {
            reserve0 += _amountIn;
            reserve1 -= amountOut;
        } else {
            reserve1 += _amountIn;
            reserve0 -= amountOut;
        }

        // Transfer token output dari DEX ke user
        tokenOut.transfer(msg.sender, amountOut);
    }
}
