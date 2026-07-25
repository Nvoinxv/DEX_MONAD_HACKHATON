import { Request, Response } from 'express';
import { tokenService } from './token.service';

class TokenController {
  public async createToken(req: Request, res: Response): Promise<void> {
    try {
      const { name, symbol, initialSupply, creatorAddress } = req.body;

      if (!name || !symbol || !initialSupply || !creatorAddress) {
        res.status(400).json({ error: 'Missing required fields: name, symbol, initialSupply, creatorAddress' });
        return;
      }

      const result = await tokenService.createTokenMetadata({
        name,
        symbol,
        initialSupply: Number(initialSupply),
        creatorAddress
      });

      res.status(201).json({
        message: 'Token creation request registered',
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  public async getTokens(req: Request, res: Response): Promise<void> {
    try {
      const tokens = await tokenService.getAllTokens();
      res.status(200).json({
        message: 'Tokens retrieved',
        data: tokens
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}

export const tokenController = new TokenController();
