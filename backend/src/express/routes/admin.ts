import express from 'express';

import Database from '../../database/Database';

import { AuthMiddleware } from '../middleware/Auth';
import { ExpressRouter } from '../../types/ExpressRouter';
import { Player } from '../../types/Player';

import Utils from '../../Utils';

export default class AdminRouter extends ExpressRouter {
    constructor(app: express.Application) {
        super(app, '/admin');
    }

    public configureRoutes(): void {
        this.router.use(AuthMiddleware.adminTokenNeeded);

        this.router.get('/players', async (req, res) => {
            res.json({ success: true, players: Array.from(Database.getPlayers().values()) });
        });

        this.router.post('/players', async (req, res) => {
            const { name } = req.body;
            if (!name) return res.status(400).json({ success: false, error: 'Missing name' });

            let id = Utils.generateId();

            while (Database.getPlayer(id)) {
                id = Utils.generateId();
            }

            const player: Player = { id, name };

            Database.registerPlayer(player);

            res.json({ success: true, player });
        });

        this.router.get('/players/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const player = Database.getPlayer(id);
            res.json({ success: true, player });
        });

        this.router.delete('/players/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            Database.deletePlayer(id);
            res.json({ success: true });
        });
    }
}