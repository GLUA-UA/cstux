import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

import { Player } from '../types/Player';
import { AdminToken } from '../types/AdminToken';

import SavesDatabase from './SavesDatabase';

class Database {

    private dataDirectory = join(__dirname, '../../data');
    
    private databases: Record<string, any> = {
        'players.json': new Map<string, Player>(),
        'admintokens.json': new Map<string, AdminToken>(),
    }

    constructor() {
        if (!existsSync(this.dataDirectory)) mkdirSync(this.dataDirectory);
        for (const [filename, database] of Object.entries(this.databases)) {
            const filePath = join(this.dataDirectory, filename);
            if (!existsSync(filePath)) {
                this.saveDatabase(filename);
            } else {
                const fileContents = readFileSync(filePath, 'utf-8');
                const parsedFileContents = JSON.parse(fileContents);
                for (const [key, value] of Object.entries(parsedFileContents)) {
                    database.set(key, value);
                }
            }
        }
    }

    public saveDatabase(filename: string): void {
        const filePath = join(this.dataDirectory, filename);
        const database = this.databases[filename];
        const databaseContents = JSON.stringify(Object.fromEntries(database));
        writeFileSync(filePath, databaseContents);
    }

    public getPlayers(): Map<string, Player> {
        return this.databases['players.json'];
    }

    public getPlayer(id: string): Player | undefined {
        return this.getPlayers().get(id);
    }

    public getAdminTokens(): Map<string, AdminToken> {
        return this.databases['admintokens.json'];
    }

    public getAdminToken(token: string): AdminToken | undefined {
        return this.getAdminTokens().get(token);
    }

    public registerPlayer(player: Player): void {
        this.getPlayers().set(player.id, player);
        SavesDatabase.saveDefaultFile(player.id);
        this.saveDatabase('players.json');
    }

    public deletePlayer(id: string): void {
        this.getPlayers().delete(id);
        this.saveDatabase('players.json');
    }

    public updatePlayer(playerId: string, player: Player): void {
        this.getPlayers().set(playerId, player);
        this.saveDatabase('players.json');
    }

    public registerAdminToken(adminToken: AdminToken): void {
        this.getAdminTokens().set(adminToken.token, adminToken);
        this.saveDatabase('admintokens.json');
    }

}

export default new Database();
