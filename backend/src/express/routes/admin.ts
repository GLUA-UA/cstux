import express from 'express';

import Database from '../../database/Database';

import { AuthMiddleware } from '../middleware/Auth';
import { ExpressRouter } from '../../types/ExpressRouter';
import { Player, PlayerFromDB } from '../../types/Player';

export default class AdminRouter extends ExpressRouter {
    constructor(app: express.Application) {
        super(app, '/admin');
    }

    public configureRoutes(): void {
        this.router.use(AuthMiddleware.adminTokenNeeded);

        this.router.get('/players', async (req, res) => {
            const playersFromDB = await Database.get<PlayerFromDB>('players');
            const players = playersFromDB.map(p => { return { ...p, levels: JSON.parse(p.levels) } as Player });

            res.json({ success: true, players });
        });

        this.router.post('/players', async (req, res) => {
            const { name } = req.body;
            if (!name) return res.status(400).json({ success: false, error: 'Missing name' });

            await Database.run("INSERT INTO players (name, levels) VALUES (?, ?)", name, JSON.stringify({}));

            const playersFromDB = await Database.get<PlayerFromDB>('SELECT * FROM players WHERE name = ?', name);
            const players = playersFromDB.map(p => { return { ...p, levels: JSON.parse(p.levels) } as Player });

            res.json({ success: true, player: players[0] });
        });

        this.router.get('/players/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const playersFromDB = await Database.get<PlayerFromDB>('SELECT * FROM players WHERE id = ?', id);
            if (playersFromDB.length === 0) return res.status(404).json({ success: false, error: 'Player not found' });

            const player = playersFromDB[0];
            res.json({ success: true, player: { ...player, levels: JSON.parse(player.levels) } });
        });

        this.router.put('/players/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const { name, levels } = req.body;
            if (!name || !levels) return res.status(400).json({ success: false, error: 'Missing name or levels' });

            await Database.run("UPDATE players SET name = ?, levels = ? WHERE id = ?", name, JSON.stringify(levels), id);
            res.json({ success: true, player: { id, name, levels } });
        });

        this.router.patch('/players/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const { name, levels } = req.body;
            if (!name && !levels) return res.status(400).json({ success: false, error: 'Missing name or levels' });

            const playersFromDB = await Database.get<PlayerFromDB>('SELECT * FROM players WHERE id = ?', id);
            if (playersFromDB.length === 0) return res.status(404).json({ success: false, error: 'Player not found' });

            const player = playersFromDB[0];
            await Database.run("UPDATE players SET name = ?, levels = ? WHERE id = ?", name ?? player.name, JSON.stringify(levels ?? player.levels), id);
            res.json({ success: true, player: { id, name: name ?? player.name, levels: levels ?? player.levels } });
        });

        this.router.delete('/players/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            await Database.run("DELETE FROM players WHERE id = ?", id);
            res.json({ success: true });
        });
    }
}