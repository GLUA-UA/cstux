class Utils {
    static getTimestamp(): number {
        return Math.floor(Date.now() / 1000);
    }

    static generateToken(): string {
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return token;
    }

    static generateId(): string {
        const id = Math.random().toString(36).substring(2, 8).toUpperCase();
        return id;
    }
}

export default Utils;