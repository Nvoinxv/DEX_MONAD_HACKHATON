// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SmartDEX (Basic AMM)
 * @dev Ini adalah implementasi dasar Automated Market Maker (AMM) dengan rumus konstan x * y = k.
 * Untuk hackathon ini, kontrak disederhanakan untuk menangani swap antara DUA token spesifik (Pair).
 */
contract SmartDEX is ReentrancyGuard {
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    // Cadangan (reserve) dari masing-masing token di dalam pool
    uint256 public reserve0;
    uint256 public reserve1;

    // Total pasokan Liquidity Provider (LP) shares
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1);
    event Swap(address indexed sender, uint256 amountIn, address tokenIn, uint256 amountOut);

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    /**
     * @dev Fungsi internal untuk mencetak LP token
     */
    function _mint(address _to, uint256 _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    /**
     * @dev Menambahkan likuiditas ke dalam pool dan memberikan LP token sebagai buktinya.
     */
    function addLiquidity(uint256 _amount0, uint256 _amount1) external nonReentrant returns (uint256 shares) {
        // Tarik token dari user ke smart contract ini
        token0.transferFrom(msg.sender, address(this), _amount0);
        token1.transferFrom(msg.sender, address(this), _amount1);

        // Jika ini adalah penambahan likuiditas pertama kali
        if (totalSupply == 0) {
            shares = _sqrt(_amount0 * _amount1);
        } else {
            // Hitung secara proporsional berdasarkan reserve yang ada
            shares = _min(
                (_amount0 * totalSupply) / reserve0,
                (_amount1 * totalSupply) / reserve1
            );
        }
        
        require(shares > 0, "shares = 0");
        _mint(msg.sender, shares);
        
        // Update reserve dengan saldo terbaru di kontrak ini
        reserve0 = token0.balanceOf(address(this));
        reserve1 = token1.balanceOf(address(this));
        
        emit Mint(msg.sender, _amount0, _amount1);
    }

    /**
     * @dev Fungsi utama untuk melakukan pertukaran token (Swap)
     * Menggunakan rumus AMM x * y = k 
     * @param _tokenIn Alamat token yang akan dijual
     * @param _amountIn Jumlah token yang akan dijual
     */
    function swap(address _tokenIn, uint256 _amountIn) external nonReentrant returns (uint256 amountOut) {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "Invalid token"
        );
        require(_amountIn > 0, "amount in = 0");

        bool isToken0 = _tokenIn == address(token0);
        
        // Tentukan token mana yang masuk (In) dan keluar (Out)
        (IERC20 tokenIn, IERC20 tokenOut, uint256 reserveIn, uint256 reserveOut) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);

        // Tarik token masuk dari pengguna
        tokenIn.transferFrom(msg.sender, address(this), _amountIn);

        // Hitung jumlah yang akan dikeluarkan menggunakan xy=k
        // Potongan Fee 0.3% untuk Liquidity Provider
        uint256 amountInWithFee = _amountIn * 997; 
        amountOut = (reserveOut * amountInWithFee) / ((reserveIn * 1000) + amountInWithFee);
        
        // Kirim token keluar ke pengguna
        tokenOut.transfer(msg.sender, amountOut);

        // Perbarui cadangan
        reserve0 = token0.balanceOf(address(this));
        reserve1 = token1.balanceOf(address(this));
        
        emit Swap(msg.sender, _amountIn, _tokenIn, amountOut);
    }

    // --- Helper Math Functions ---
    function _sqrt(uint y) private pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }
}
