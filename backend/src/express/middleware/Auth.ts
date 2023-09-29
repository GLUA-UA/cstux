import express from 'express';
import Database from '../../database/Database';

export class AuthMiddleware {
    public static async adminTokenNeeded(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const [type, value] = token.split(' ');
        if (type !== 'Bearer') return res.status(401).json({ error: 'Invalid token type' });

        const validToken = Database.getAdminToken(value);
        if (!validToken) return res.status(401).json({ error: 'Invalid token' });
        if (validToken.expiresAt < Date.now()) return res.status(401).json({ error: 'Expired token' });

        next();
    }

    public static generateToken(): string {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return token;
    }
}