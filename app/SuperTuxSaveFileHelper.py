class SuperTuxSaveFileHelper():
    def __init__(self, parsedContents):
        self.parsedContents = parsedContents
        self.parseLevelsInfo()
    
    def parseLevelsInfo(self):
        levelsInfo = {}
        for levelInfo in self.parsedContents[4][2][1][3]:
            levelName = levelInfo[0]
            levelTime = levelInfo[1]
            levelsInfo[levelName] = levelTime
        self.levelsInfo = levelsInfo

    def getTimeForLevel(self, ):
        levels = self.parsedContents[4][2][1][3]
        for levelInfo in levels:
            levelName = levelInfo[0]
            if not levelName.endswith(".stl"):
                continue
            levelSolved = True if levelInfo[2][0] == "statistics" else False
            levelTime = levelInfo[2][3][1] if levelSolved else None
        print("")