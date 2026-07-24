export type BotState = 'RUNNING' | 'PAUSED' | 'STOPPED';

export class BotRuntimeManager {
    // Menyimpan status bot secara live (menggunakan memori lokal)
    static states: Map<string, BotState> = new Map();

    static startBot(botId: string) {
        this.states.set(botId, 'RUNNING');
        console.log(`[Runtime] Bot ${botId} status berubah jadi: RUNNING 🟢`);
    }

    static pauseBot(botId: string) {
        this.states.set(botId, 'PAUSED');
        console.log(`[Runtime] Bot ${botId} status berubah jadi: PAUSED ⏸️`);
    }

    static stopBot(botId: string) {
        this.states.set(botId, 'STOPPED');
        console.log(`[Runtime] Bot ${botId} status berubah jadi: STOPPED 🛑`);
    }

    static isBotRunning(botId: string): boolean {
        return this.states.get(botId) === 'RUNNING';
    }
}
