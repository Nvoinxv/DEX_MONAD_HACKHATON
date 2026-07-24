// Simulasi CRUD konfigurasi bot ke database
export interface BotConfig {
    id: string;
    userId: string;
    strategyId: string;
    tokenIn: string;
    tokenOut: string;
    amount: number;
}

export class BotConfigService {
    // Array lokal sementara buat gantiin PostgreSQL (selama testing)
    static configs: BotConfig[] = [];

    static saveConfig(config: BotConfig) {
        this.configs.push(config);
        console.log(`[Config] Bot config baru disimpan dengan ID: ${config.id}`);
        return config;
    }

    static getConfig(id: string) {
        return this.configs.find(c => c.id === id);
    }
}
