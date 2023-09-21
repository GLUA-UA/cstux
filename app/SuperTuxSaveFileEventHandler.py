import logging
from sexpdata import loads
from watchdog.events import FileSystemEventHandler

from SuperTuxSaveFileHelper import SuperTuxSaveFileHelper

fileExtension = ".stsg"

class SuperTuxSaveFileEventHandler(FileSystemEventHandler):
    """Watches all modified SuperTux Save Files."""

    def __init__(self, logger=None):
        super().__init__()
        self.logger = logger or logging.root
        self.logger.debug("SuperTuxSaveFileEventHandler initialized.")

    def on_moved(self, event):
        super().on_moved(event)
        if not event.is_directory and event.src_path.endswith(fileExtension) and event.dest_path.endswith(fileExtension):
            srcProfileName = event.src_path.split("/")[-1].split(".")[0]
            destProfileName = event.dest_path.split("/")[-1].split(".")[0]
            self.logger.info("Renamed profile: from %s to %s", srcProfileName, destProfileName)

    def on_created(self, event):
        super().on_created(event)
        if not event.is_directory:
            profileName = event.src_path.split("/")[-1].split(".")[0]
            self.logger.info("Created profile: %s", profileName)

    def on_deleted(self, event):
        super().on_deleted(event)
        if not event.is_directory:
            profileName = event.src_path.split("/")[-1].split(".")[0]
            self.logger.info("Deleted profile: %s", profileName)

    def on_modified(self, event):
        super().on_modified(event)
        if not event.is_directory:
            profileName = event.src_path.split("/")[-1].split(".")[0]
            self.logger.info("Modified profile: %s", profileName)
            handleChangedFile(event.src_path)

def handleChangedFile(fileName):
    if not fileName.endswith(fileExtension):
        return
    
    with open(fileName, "r") as f:
        fileContents = f.read()
        parsedContents = loads(fileContents)
        helper = SuperTuxSaveFileHelper(parsedContents)
        helper.parseLevelsInfo()
        