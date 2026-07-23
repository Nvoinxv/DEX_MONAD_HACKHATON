export function calculateVolume(volumes: number[]): number {
    // Menghitung total volume dari sebuah rentang waktu
    return volumes.reduce((a, b) => a + b, 0);
}
