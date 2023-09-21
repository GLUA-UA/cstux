import express from 'express';

export abstract class ExpressRouter {
    public app: express.Application;
    public router: express.Router;
    public endpoint: string;

    constructor(app: express.Application, endpoint: string) {
        this.app = app;
        this.router = express.Router();
        this.endpoint = endpoint;
        this.configureRoutes();
    }

    public abstract configureRoutes(): void;
}