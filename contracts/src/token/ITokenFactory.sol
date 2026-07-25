// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// =============================================================================
// ITokenFactory — Interface untuk TokenFactory
//
// Interface ini mendefinisikan "kontrak perjanjian" antara TokenFactory
// dengan kontrak lain yang mau berinteraksi dengannya.
//
// Analoginya: ITokenFactory ini ibarat menu restoran — lu bisa lihat apa yang
// tersedia tanpa harus masuk dapur (melihat kode implementasinya).
//
// Kenapa penting di Monad?
// - Kontrak lain (seperti TradingBotVault) bisa import interface ini yang
//   lebih ringan daripada import seluruh kontrak TokenFactory.
// - Ini memperkecil bytecode dan mempercepat deployment.
// =============================================================================

interface ITokenFactory {
    // =========================================================================
    // EVENTS
    // =========================================================================

    /// @notice Dipancarkan setiap kali token baru berhasil dibuat
    /// @param tokenAddress Alamat kontrak token yang baru dibuat
    /// @param name Nama token
    /// @param symbol Simbol token (ticker)
    /// @param creator Wallet yang membuat token
    /// @param initialSupply Total supply awal (dalam satuan token, bukan wei)
    /// @param timestamp Waktu pembuatan token (block timestamp)
    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address indexed creator,
        uint256 initialSupply,
        uint256 timestamp
    );

    // =========================================================================
    // STRUCTS
    // =========================================================================

    /// @notice Menyimpan informasi ringkas tentang sebuah token
    struct TokenInfo {
        address tokenAddress; // Alamat kontrak token
        string name;          // Nama token
        string symbol;        // Simbol token
        uint256 initialSupply; // Supply awal
        uint256 createdAt;    // Timestamp pembuatan
    }

    // =========================================================================
    // FUNCTIONS
    // =========================================================================

    /// @notice Membuat token ERC20 baru di atas Monad
    /// @param name Nama token (tidak boleh kosong, max 50 karakter)
    /// @param symbol Simbol token (tidak boleh kosong, max 10 karakter)
    /// @param initialSupply Jumlah token awal (min 1, max 1 triliun)
    /// @return Alamat kontrak token yang baru dibuat
    function createToken(
        string calldata name,
        string calldata symbol,
        uint256 initialSupply
    ) external returns (address);

    /// @notice Mengambil semua token yang dibuat oleh address tertentu
    /// @param creator Alamat wallet yang membuat token
    /// @return Array berisi struct TokenInfo milik creator tersebut
    function getTokensByCreator(address creator) external view returns (TokenInfo[] memory);

    /// @notice Mengambil total keseluruhan token yang pernah dibuat
    /// @return Jumlah token yang sudah dibuat
    function getTotalTokens() external view returns (uint256);

    /// @notice Cek apakah sebuah alamat adalah token yang dibuat oleh factory ini
    /// @param tokenAddress Alamat yang ingin dicek
    /// @return true jika token dibuat melalui factory ini
    function isRegisteredToken(address tokenAddress) external view returns (bool);
}
