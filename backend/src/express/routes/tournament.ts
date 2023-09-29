import express from 'express';

import { ExpressRouter } from '../../types/ExpressRouter';
import SuperTuxHelper from '../../supertux/SuperTuxHelper';
import Database from '../../database/Database';

import { AuthMiddleware } from '../middleware/Auth';

export default class TournamentRouter extends ExpressRouter {
    constructor(app: express.Application) {
        super(app, '/tournament');
    }

    public configureRoutes(): void {
        this.router.get('/', async (req, res) => {
            res.json({ success: true, tournamentStarted: SuperTuxHelper.isTournamentStarted(), tournamentStartedTimestamp: SuperTuxHelper.getTournamentStartedTimestamp() });
        });

        this.router.post('/start', AuthMiddleware.adminTokenNeeded, async (req, res) => {
            SuperTuxHelper.startTournament();
            res.json({ success: true, tournamentStarted: SuperTuxHelper.isTournamentStarted(), tournamentStartedTimestamp: SuperTuxHelper.getTournamentStartedTimestamp() });
        });

        this.router.get('/players', async (req, res) => {
            // Remove player id from response
            const players = Array.from(Database.getPlayers().values()).map(player => {
                player.id = "000000";
                return player;
            });
            res.json({ success: true, players });
        });
    }
}