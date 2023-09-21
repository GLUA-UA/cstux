import time
import logging
from sys import argv
from watchdog.observers import Observer

from SuperTuxSaveFileEventHandler import SuperTuxSaveFileEventHandler

def startWatcher():
    pathToWatch = argv[1] if len(argv) > 1 else 'profiles'
    event_handler = SuperTuxSaveFileEventHandler()
    observer = Observer()
    observer.schedule(event_handler, pathToWatch, recursive=False)
    logging.info("Watching for changes in %s", pathToWatch)
    logging.info("Press Ctrl+C to stop.")
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

def main():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    startWatcher()

if __name__ == "__main__":
    main()