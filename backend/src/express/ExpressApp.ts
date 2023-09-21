import cors from 'cors';
import express from 'express';
import { readdirSync } from 'fs';
import { ExpressRouter } from '../types/ExpressRouter';

export class ExpressApp {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.configureRoutes();
    }

    public configureRoutes(): void {
        const routerFiles = readdirSync(`${__dirname}/routes`);
        routerFiles.forEach((file) => {
            const router = require(`./routes/${file}`).default as ExpressRouter;
            this.app.use(router.endpoint, router.router);
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }

}