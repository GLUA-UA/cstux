class SuperTuxHelper {
    private tournamentStarted: boolean = false;
    private tournamentStartedTimestamp: number = 0;

    public startTournament(): void {
        this.tournamentStarted = true;
        this.tournamentStartedTimestamp = Date.now();
    }

    public isTournamentStarted(): boolean {
        return this.tournamentStarted;
    }

    public getTournamentStartedTimestamp(): number {
        return this.tournamentStartedTimestamp;
    }
}

export default new SuperTuxHelper();