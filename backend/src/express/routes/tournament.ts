import express from 'express';

import { ExpressRouter } from '../../types/ExpressRouter';
import SuperTuxHelper from '../../supertux/SuperTuxHelper';

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
    }
}