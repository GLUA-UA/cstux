import sqlite3 from 'sqlite3';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';

class Database {

    private dataDirectory = join(__dirname, '../../data');
    private db: sqlite3.Database;

    constructor() {
        if (!existsSync(this.dataDirectory)) mkdirSync(this.dataDirectory);
        this.db = new sqlite3.Database(join(this.dataDirectory, 'db.sqlite3'));
    }

    public initDB(): void {
        const fileContents = readFileSync(join(__dirname, "../../init.sql"), 'utf-8');
        for (const sql of fileContents.split(';')) {
            const sqlToExecute = sql.trim();
            if (sqlToExecute.length === 0) continue;
            this.db.exec(sqlToExecute);
        }
    }

    public async get<T>(sql: string, ...params: any[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.prepare(sql, params).all((err, rows) => {
                if (err) reject(err);
                resolve(rows as T[]);
            });
        });
    }

    public async run(sql: string, ...params: any[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.prepare(sql, params).run((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

}

export default new Database();
