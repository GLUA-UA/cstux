import express from 'express';
import multer from 'multer';
import { readFileSync } from 'fs';

import { ExpressRouter } from '../../types/ExpressRouter';
import SuperTuxHelper from '../../supertux/SuperTuxHelper';

import Database from '../../database/Database';
import SavesDatabase from '../../database/SavesDatabase';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, SavesDatabase.tempDataDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export default class PlayerRouter extends ExpressRouter {
    constructor(app: express.Application) {
        super(app, '/player');
    }

    public configureRoutes(): void {
        this.router.get('/:id', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const player = Database.getPlayer(id);
            if (!player) return res.status(404).json({ success: false, error: 'Player not found' });

            res.json({ success: true, player });
        });

        this.router.get('/:id/save', async (req, res) => {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const player = Database.getPlayer(id);
            if (!player && id !== "000000") return res.status(404).json({ success: false, error: 'Player not found' });

            const file = SavesDatabase.getFile(id);
            if (!file) return res.status(404).json({ success: false, error: 'Save file not found' });

            res.send(file);
        });

        this.router.post('/submit/:id', upload.single('file'), async (req, res) => {
            if (!SuperTuxHelper.isTournamentStarted())
                return res.status(400).json({ success: false, error: 'Tournament not started' });

            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, error: 'Missing id' });

            const player = Database.getPlayer(id);
            if (!player) return res.status(404).json({ success: false, error: 'Player not found' });
            if (player.endedTournament) return res.status(400).json({ success: false, error: 'Player already ended tournament' });

            const { file } = req;
            if (!file) return res.status(400).json({ success: false, error: 'Missing file' });

            SavesDatabase.saveFile(id, readFileSync(file.path));

            res.json({ success: true })
        });
    }
}