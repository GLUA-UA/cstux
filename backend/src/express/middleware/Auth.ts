import express from 'express';
import Database from '../../database/Database';

import { AdminToken } from '../../types/AdminToken'

export class AuthMiddleware {
    public static async adminTokenNeeded(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const [type, value] = token.split(' ');
        if (type !== 'Bearer') return res.status(401).json({ error: 'Invalid token type' });

        const validToken = await Database.get<AdminToken>('SELECT * FROM admin_tokens WHERE token = ?', value);
        if (validToken.length === 0) return res.status(401).json({ error: 'Invalid token' });
        if (validToken[0].expires_at < Date.now()) return res.status(401).json({ error: 'Expired token' });

        next();
    }

    public static generateToken(): string {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return token;
    }
}