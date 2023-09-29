import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';

class SavesDatabase {

    private dataDirectory = join(__dirname, '../../data/saves');
    public tempDataDirectory = join(__dirname, '../../data/saves/tmp');

    private defaultDirectory = join(__dirname, '../../default');
    private fullGameSaveFile = join(this.defaultDirectory, './full_game.stsg');
    private emptyGameSaveFile = join(this.defaultDirectory, './empty_game.stsg');

    constructor() {
        if (!existsSync(this.dataDirectory)) mkdirSync(this.dataDirectory);
        if (!existsSync(this.tempDataDirectory)) mkdirSync(this.tempDataDirectory);
        if (!existsSync(this.defaultDirectory)) throw new Error('Default directory does not exist');
        this.saveDefaultFile("000000", true);
    }

    public saveFile(userId: string, contents: Buffer): void {
        const filePath = join(this.dataDirectory, `userId-${userId}.stsg`);
        writeFileSync(filePath, contents);
    }

    public getFile(userId: string): Buffer | undefined {
        if (!existsSync(join(this.dataDirectory, `userId-${userId}.stsg`))) return undefined;
        return readFileSync(join(this.dataDirectory, `userId-${userId}.stsg`));
    }

    public saveDefaultFile(userId: string, fullGame: boolean = false) {
        const filePath = join(this.dataDirectory, `userId-${userId}.stsg`);
        if (fullGame) copyFileSync(this.fullGameSaveFile, filePath);
        else copyFileSync(this.emptyGameSaveFile, filePath);
    }

}

export default new SavesDatabase();
