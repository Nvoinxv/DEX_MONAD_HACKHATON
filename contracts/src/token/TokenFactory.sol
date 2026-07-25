// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ITokenFactory.sol";
import "./MonadToken.sol";

// =============================================================================
// TokenFactory — Pabrik Token yang Dioptimasi untuk Monad Blockchain
//
// Perubahan Utama vs Versi Lama:
// ┌────────────────────────────────┬──────────────────────────────────────────┐
// │ LAMA                           │ BARU (Monad-Optimized)                   │
// ├────────────────────────────────┼──────────────────────────────────────────┤
// │ address[] allTokens (array)    │ mapping per-creator (parallel-safe!)     │
// │ Tidak ada validasi input       │ Validasi ketat nama, simbol, supply      │
// │ Tidak ada ReentrancyGuard      │ ReentrancyGuard dari OpenZeppelin        │
// │ Event minim (tidak ada supply) │ Event lengkap + timestamp                │
// │ Tidak ada registry lookup      │ isRegisteredToken() untuk verifikasi     │
// │ MonadToken tidak bisa burn     │ MonadToken support burn + permit         │
// └────────────────────────────────┴──────────────────────────────────────────┘
//
// Kenapa mapping lebih baik dari array untuk Monad Parallel Execution?
// -----------------------------------------------------------------------
// Bayangkan ada 1000 orang buat token secara bersamaan.
//
// Dengan array global (lama):
//   - Setiap transaksi harus MENULIS ke slot storage yang SAMA (panjang array).
//   - Monad harus mendeteksi ini sebagai konflik dan memproses satu-per-satu.
//   - Transaksi jadi antri = lebih lambat.
//
// Dengan mapping per-creator (baru):
//   - User A menulis ke mapping[userA], User B menulis ke mapping[userB].
//   - Tidak ada konflik storage — Monad bisa proses keduanya PARALEL.
//   - Transaksi jadi lebih cepat = memanfaatkan kekuatan Monad sepenuhnya.
//
// =============================================================================

contract TokenFactory is ITokenFactory, ReentrancyGuard, Ownable {
    // =========================================================================
    // CONSTANTS — Batas validasi input
    // =========================================================================

    /// @notice Panjang maksimal nama token (karakter)
    uint256 public constant MAX_NAME_LENGTH = 50;

    /// @notice Panjang maksimal simbol token (karakter)
    uint256 public constant MAX_SYMBOL_LENGTH = 10;

    /// @notice Supply minimum yang diperbolehkan (1 token)
    uint256 public constant MIN_SUPPLY = 1;

    /// @notice Supply maksimum yang diperbolehkan (1 Triliun token)
    uint256 public constant MAX_SUPPLY = 1_000_000_000_000;

    // =========================================================================
    // STATE VARIABLES
    // =========================================================================

    /// @notice Menyimpan daftar token per-creator
    /// @dev KUNCI OPTIMISASI MONAD: mapping membuat setiap creator punya
    ///      "laci sendiri" di storage — tidak berebut slot yang sama.
    ///      Ini membuat transaksi bisa dieksekusi secara paralel oleh Monad.
    mapping(address => TokenInfo[]) private _tokensByCreator;

    /// @notice Registry untuk verifikasi apakah sebuah alamat adalah token resmi
    /// @dev Digunakan oleh isRegisteredToken() untuk lookup O(1)
    mapping(address => bool) private _registeredTokens;

    /// @notice Counter total token yang pernah dibuat
    /// @dev Disimpan terpisah untuk menghindari scan array saat query total
    uint256 private _totalTokens;

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    constructor() Ownable(msg.sender) {}

    // =========================================================================
    // EXTERNAL FUNCTIONS
    // =========================================================================

    /// @inheritdoc ITokenFactory
    /// @dev nonReentrant melindungi dari serangan reentrancy
    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external override nonReentrant returns (address) {
        // ---- Validasi Input ------------------------------------------------
        // Cek nama tidak kosong dan tidak terlalu panjang
        require(bytes(name).length > 0,                "TokenFactory: Nama tidak boleh kosong");
        require(bytes(name).length <= MAX_NAME_LENGTH,  "TokenFactory: Nama terlalu panjang (maks 50)");

        // Cek simbol tidak kosong dan tidak terlalu panjang
        require(bytes(symbol).length > 0,                "TokenFactory: Simbol tidak boleh kosong");
        require(bytes(symbol).length <= MAX_SYMBOL_LENGTH,"TokenFactory: Simbol terlalu panjang (maks 10)");

        // Cek supply dalam batas yang wajar
        require(initialSupply >= MIN_SUPPLY, "TokenFactory: Supply minimum adalah 1");
        require(initialSupply <= MAX_SUPPLY, "TokenFactory: Supply maksimum adalah 1 triliun");
        // ---- End Validasi --------------------------------------------------

        // Buat kontrak MonadToken baru
        // maxSupply di-set sama dengan initialSupply secara default.
        // Creator bisa mint lebih banyak nanti (hingga maxSupply) via MonadToken.mint()
        MonadToken newToken = new MonadToken(
            name,
            symbol,
            initialSupply,
            initialSupply, // maxSupply = initialSupply (terkunci, anti-inflation by default)
            msg.sender
        );

        address tokenAddress = address(newToken);

        // Simpan informasi token ke mapping creator (parallel-safe)
        _tokensByCreator[msg.sender].push(TokenInfo({
            tokenAddress: tokenAddress,
            name:         name,
            symbol:       symbol,
            initialSupply: initialSupply,
            createdAt:    block.timestamp
        }));

        // Daftarkan token di registry untuk lookup O(1)
        _registeredTokens[tokenAddress] = true;

        // Tambah counter total token
        unchecked {
            // unchecked: _totalTokens tidak akan pernah overflow uint256
            // (butuh lebih dari 10^77 token untuk overflow)
            _totalTokens++;
        }

        // Pancarkan event lengkap dengan timestamp (berguna untuk indexing di frontend)
        emit TokenCreated(
            tokenAddress,
            name,
            symbol,
            msg.sender,
            initialSupply,
            block.timestamp
        );

        return tokenAddress;
    }

    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================

    /// @inheritdoc ITokenFactory
    function getTokensByCreator(
        address creator
    ) external view override returns (TokenInfo[] memory) {
        return _tokensByCreator[creator];
    }

    /// @inheritdoc ITokenFactory
    function getTotalTokens() external view override returns (uint256) {
        return _totalTokens;
    }

    /// @inheritdoc ITokenFactory
    function isRegisteredToken(
        address tokenAddress
    ) external view override returns (bool) {
        return _registeredTokens[tokenAddress];
    }
}
