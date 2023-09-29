import express from 'express';

import Database from '../../database/Database';

import { AuthMiddleware } from '../middleware/Auth';
import { ExpressRouter } from '../../types/ExpressRouter';
import { AdminToken } from '../../types/AdminToken';

export default class TokenRouter extends ExpressRouter {
    constructor(app: express.Application) {
        super(app, '/token');
    }

    public configureRoutes(): void {
        this.router.post('/', (req, res) => {
            if (!req.body) return res.status(400).json({ success: false, error: 'Missing body' });
            const { adminTokenKey } = req.body;
            if (!adminTokenKey) return res.status(400).json({ success: false, error: 'Missing adminTokenKey' });

            if (adminTokenKey !== process.env.ADMIN_TOKEN_KEY) return res.status(401).json({ success: false, error: 'Invalid adminTokenKey' });

            const token = AuthMiddleware.generateToken();
            const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

            const adminToken: AdminToken = { token, expiresAt };
            
            Database.registerAdminToken(adminToken);
            res.json({ success: true, adminToken });
        });

        this.router.get('/', AuthMiddleware.adminTokenNeeded, (req, res) => {
            const adminTokens = Array.from(Database.getAdminTokens().values());
            res.json({ success: true, adminTokens });
        });
    }
}