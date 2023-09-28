import parse from "s-expression";

import Database from "../database/Database";

const validLevels = [
    { levelId: "welcome_antarctica", levelName: "Welcome to Antarctica" },
    { levelId: "journey_begins", levelName: "The Journey Begins" },
    { levelId: "somewhat_smaller_bath", levelName: "The Somewhat Smaller Bath" },
    { levelId: "fork_in_the_road", levelName: "A Fork in the Road", nextLevelId: "DEPENDS" },
    { levelId: "more_snowballs", levelName: "Oh No! More Snowballs", nextLevelId: "stone_cold" },
    { levelId: "via_nostalgica", levelName: "Via Nostalgica" },
    { levelId: "frosted_fields", levelName: "The Frosted Fields" },
    { levelId: "stone_cold", levelName: "Stone Cold" },
    { levelId: "23rd_airborne", levelName: "23rd Airborne" },
    { levelId: "above_arctic_skies", levelName: "Above the Arctic Skies" },
    { levelId: "night_chill", levelName: "Night Chill" },
    { levelId: "into_stars", levelName: "Into the Stars" },
    { levelId: "entrance_cave", levelName: "Entrance to the Cave" },
    { levelId: "under_the_ice", levelName: "Under the Ice" },
    { levelId: "living_inside_fridge", levelName: "Living in a Fridge" },
    { levelId: "or_just_me", levelName: "...Or Is It Just Me?" },
    { levelId: "miyamoto_monument", levelName: "Miyamoto Monument" },
    { levelId: "ice_in_the_hole", levelName: "Ice in the Hole" },
    { levelId: "end_of_tunnel", levelName: "End of the Tunnel" },
    { levelId: "path_in_the_clouds", levelName: "A Path in the Clouds" },
    { levelId: "icy_valley", levelName: "Icy Valley" },
    { levelId: "frozen_bridge", levelName: "Over the Frozen Bridge" },
    { levelId: "shattered_bridge", levelName: "The Shattered Bridge" },
    { levelId: "castle_of_nolok", levelName: "The Castle of Nolok" },
    { levelId: "yeti_boss", levelName: "No More Mr. Ice Guy" },
];

class SaveFileHandler {
    public handleReceivedSaveFile(userId: string, contents: Buffer) {
        const player = Database.getPlayer(userId);
        if (!player) return;

        const parsed = parse(contents.toString());
        const levelsWrong = [];
        const [header, ...rest] = parsed;
        const state = rest.find((x: any) => x[0] === 'state');
        const [stateHeader, ...stateData] = state;
        const worlds = stateData.find((x: any) => x[0].toString() === 'worlds');
        const [worldsHeader, ...worldsData] = worlds;
        const world = worldsData.find((x: any) => x[0].toString() === '/levels/world1/worldmap.stwm');
        const [worldHeader, ...worldData] = world;
        const levels = worldData.find((x: any) => x[0].toString() === 'levels');
        const [levelsHeader, ...levelsData] = levels;
        for (const level of levelsData) {
            const [levelHeader, ...levelData] = level;
            const levelName = levelHeader.split('.')[0];
            const levelSolved = levelData.find((x: any) => x[0].toString() === 'solved');
            levelsWrong.push([ levelName, levelSolved[1] === "#t" ]);
        }

        let levelsMap = [];
        for (const level of validLevels) {
            const found = levelsWrong.find((x: any) => x[0] === level.levelId);
            if (found) {
                levelsMap.push(found);
            } else {
                levelsMap.push([level.levelId, false]);
            }
        }

        let lastLevel = "";
        for (const level of levelsMap) {
            if (level[1]) lastLevel = level[0];
        }
        const lastLevelObject = validLevels.find((x: any) => x.levelId === lastLevel)!;

        player.endedTournament = levelsMap.find((x: any) => x[0] === 'yeti_boss')![1];
        player.levelsCompleted = levelsMap.filter((x: any) => x[1]).length;
        player.lastCompletedLevel = lastLevelObject.levelName;

        if (lastLevelObject.nextLevelId === "DEPENDS") {
            player.nextLevel = "Depends on your choice";
        } else if (lastLevelObject.nextLevelId) {
            player.nextLevel = validLevels.find((x: any) => x.levelId === lastLevelObject.nextLevelId)!.levelName;
        } else {
            const currIndex = validLevels.findIndex((x: any) => x.levelId === lastLevelObject.levelId);
            player.nextLevel = validLevels[currIndex + 1].levelName;
        }

        if (player.levelsCompleted === 0) {
            player.lastCompletedLevel = "None";
            player.nextLevel = validLevels[0].levelName;
        }

        Database.updatePlayer(userId, player);
    }
}