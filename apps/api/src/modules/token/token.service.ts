export interface TokenPayload {
  name: string;
  symbol: string;
  initialSupply: number;
  creatorAddress: string;
}

class TokenService {
  private tokens: Array<TokenPayload & { id: string; status: string }> = [];

  public async createTokenMetadata(payload: TokenPayload) {
    // In a real implementation, this would save to a database and track the on-chain creation process.
    const newToken = {
      id: Date.now().toString(),
      ...payload,
      status: 'pending_deployment', // Awaiting smart contract deployment via TokenFactory
    };
    this.tokens.push(newToken);
    return newToken;
  }

  public async getAllTokens() {
    return this.tokens;
  }
}

export const tokenService = new TokenService();
