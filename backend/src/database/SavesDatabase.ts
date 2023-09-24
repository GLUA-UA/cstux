import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

class SavesDatabase {

    private dataDirectory = join(__dirname, '../../data/saves');

    constructor() {
        if (!existsSync(this.dataDirectory)) mkdirSync(this.dataDirectory);
    }

    public saveFile(userId: string, contents: Buffer): void {
        const filePath = join(this.dataDirectory, `userId-${userId}.json`);
        writeFileSync(filePath, contents);
    }

    public getFile(userId: string): Buffer | undefined {
        if (!existsSync(join(this.dataDirectory, `userId-${userId}.json`))) return undefined;
        return readFileSync(join(this.dataDirectory, `userId-${userId}.json`));
    }

}

export default new SavesDatabase();
