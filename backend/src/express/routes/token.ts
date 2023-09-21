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
            const { adminTokenKey } = req.body;
            if (!adminTokenKey) return res.status(400).json({ success: false, error: 'Missing adminTokenKey' });

            if (adminTokenKey !== process.env.ADMIN_TOKEN_KEY) return res.status(401).json({ success: false, error: 'Invalid adminTokenKey' });

            const token = AuthMiddleware.generateToken();
            const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
            Database.run('INSERT INTO admin_tokens (token, expires_at) VALUES (?, ?)', token, expiresAt).then(() => {
                res.json({ success: true, token, expiresAt });
            }).catch((err) => {
                res.status(500).json({ success: false, error: err });
            });
        });

        this.router.get('/', AuthMiddleware.adminTokenNeeded, (req, res) => {
            Database.get<AdminToken>('SELECT * FROM admin_tokens').then((tokens) => {
                res.json({ success: true, tokens });
            }).catch((err) => {
                res.status(500).json({ success: false, error: err });
            });
        });

        this.router.delete('/:id', AuthMiddleware.adminTokenNeeded, (req, res) => {
            const { id } = req.body;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            Database.run('DELETE FROM admin_tokens WHERE id = ?', id).then(() => {
                res.json({ success: true });
            }).catch((err) => {
                res.status(500).json({ success: false, error: err });
            });
        });
    }
}