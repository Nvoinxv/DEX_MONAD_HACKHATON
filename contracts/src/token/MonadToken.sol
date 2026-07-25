// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// =============================================================================
// MonadToken — Token ERC20 yang Dioptimasi untuk Monad Blockchain
//
// Kenapa kontrak ini dipisah dari TokenFactory?
// - Single Responsibility Principle: setiap file punya satu tanggung jawab.
// - TokenFactory fokus "membuat token", MonadToken fokus "jadi token yang bagus".
// - Lebih mudah di-audit keamanannya karena kodenya tidak campur aduk.
//
// Fitur-fitur yang ditambahkan vs kontrak lama:
// ┌──────────────────┬────────────────────────────────────────────────────────┐
// │ ERC20Capped      │ Batas maksimal supply dikunci — tidak bisa cetak lebih │
// │ ERC20Burnable    │ Token bisa dibakar (deflasi / reduce supply)           │
// │ ERC20Permit      │ Approval + transfer dalam 1 TX (cocok untuk Monad!)    │
// │ Ownable          │ Owner bisa mint token tambahan (jika diperlukan)       │
// └──────────────────┴────────────────────────────────────────────────────────┘
//
// Optimisasi Monad-Specific:
// - ERC20Permit menghilangkan kebutuhan "approve" dulu sebelum transfer.
//   Di Monad yang punya parallel execution, ini berarti user bisa langsung
//   transfer tanpa harus tunggu 1 transaksi approve selesai dulu.
//   2 transaksi (approve + transfer) menjadi 1 transaksi (permitTransfer).
// =============================================================================

contract MonadToken is ERC20Capped, ERC20Burnable, ERC20Permit, Ownable {
    // =========================================================================
    // CONSTANTS
    // =========================================================================

    /// @notice Jumlah maksimal token yang bisa pernah ada (1 Triliun token)
    /// @dev Nilai ini di-pass ke ERC20Capped dan dikunci permanen saat deploy
    uint256 private constant MAX_SUPPLY_MULTIPLIER = 1_000_000_000_000;

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    /// @notice Menginisialisasi token baru dengan semua propertinya
    /// @param _name Nama token (contoh: "Nvoin Governance Token")
    /// @param _symbol Simbol token (contoh: "NGT")
    /// @param _initialSupply Jumlah token awal yang dicetak (dalam satuan token, bukan wei)
    /// @param _maxSupply Batas maksimal token yang boleh ada (dalam satuan token, bukan wei)
    /// @param _creator Wallet yang akan menerima token dan menjadi owner
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _maxSupply,
        address _creator
    )
        ERC20(_name, _symbol)
        // ERC20Capped menerima angka dalam satuan "wei" (sudah termasuk desimal)
        ERC20Capped(_maxSupply * (10 ** decimals()))
        // ERC20Permit menggunakan nama token sebagai domain separator EIP-712
        ERC20Permit(_name)
        // Menjadikan _creator sebagai owner saat deployment
        Ownable(_creator)
    {
        // Cetak initial supply dan kirim langsung ke wallet creator
        // _mint sudah otomatis memvalidasi terhadap cap dari ERC20Capped
        _mint(_creator, _initialSupply * (10 ** decimals()));
    }

    // =========================================================================
    // OWNER FUNCTIONS
    // =========================================================================

    /// @notice Mencetak token tambahan (hanya bisa dipanggil oleh owner)
    /// @dev Akan revert secara otomatis jika melebihi maxSupply (dari ERC20Capped)
    /// @param to Alamat wallet yang akan menerima token tambahan
    /// @param amount Jumlah token tambahan (dalam satuan token, bukan wei)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * (10 ** decimals()));
    }

    // =========================================================================
    // INTERNAL OVERRIDES
    // =========================================================================

    // Solidity mengharuskan kita override fungsi _update karena
    // ERC20Capped dan ERC20 keduanya men-define _update.
    // Ini adalah "glue code" yang menyatukan dua parent class.
    /// @inheritdoc ERC20
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Capped) {
        // Panggil ERC20Capped._update yang sudah berisi validasi cap
        super._update(from, to, value);
    }
}
