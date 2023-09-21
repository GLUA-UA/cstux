from sexpdata import loads, dumps

def main():
    saveFileLocation = "profiles/profile1.stsg"
    with open(saveFileLocation, "r") as f:
        fileContents = f.read()
        parsedContent = loads(fileContents)[4][2][1][3]
        for levelInfo in parsedContent:
            levelName = levelInfo[0]
            if not levelName.endswith(".stl"):
                continue
            levelSolved = True if levelInfo[2][0] == "statistics" else False
            levelTime = levelInfo[2][3][1] if levelSolved else None
            print("{:>30} - {}".format(levelName.split('.')[0], levelTime))
        print("")

if __name__ == '__main__':
    main()