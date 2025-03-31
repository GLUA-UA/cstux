import 'dart:io';
import 'dart:async';
import 'dart:convert';
import 'package:path/path.dart' as p;
import 'package:watcher/watcher.dart';
import 'package:process_run/shell.dart';
import 'package:http/http.dart' as http;
import 'package:client/logic/requester.dart';

typedef TournamentStatusCallback = void Function(String tournamentStatus);

var shell;

Future gameHandler(
  String playerAccessCode,
  TournamentStatusCallback updateGameStatus,
) async {
  Timer.periodic(
    const Duration(milliseconds: 2000),
    (timer) async {
      final http.Response response = await getTournamentStatus();
      if (response.statusCode == 200) {
        Map<String, dynamic> srlResponse = jsonDecode(response.body);
        if (srlResponse['statValue'] == "true") {
          timer.cancel();
          updateGameStatus("c");
          if (shell != null) {
            shell.kill();
          }
          await startGame(playerAccessCode);
        } else {
          updateGameStatus("t");
        }
      }
    },
  );
}

Future startGame(String playerAccessCode) async {
  // FOLDER STRUCTURE
  //
  // [ROOTDIR]
  // |- client.exe / client  - - - - - - - - - - - - - (this executable)
  // |- [game_dir]
  //    |- [user_dir]
  //       |- config - - - - - - - - - - - - - - - - - (config files)
  //       |- [profile1]
  //          |- world1.stsg - - - - - - - - - - - - - (save files)
  //    |- [supertux]
  //       |- [bin]
  //          |- supertux2.exe / supertux.AppImage - - (game executables)
  //       |- [saves]
  //          |- training-mode.stsg
  //          |- competition-mode.stsg
  //

  try {
    final String rootDir = p.dirname(Platform.resolvedExecutable);
    final String userDir =
        (await Directory(p.join(rootDir, "game_dir/user_dir")).create()).path;
    final String profileDir =
        (await Directory(p.join(userDir, "profile1")).create()).path;
    final String saveFilePath = p.join(profileDir, "world1.stsg");

    final String alreadyStartedFilePath =
        p.join(rootDir, "game_dir/supertux/already-started");
    
    if (!File(alreadyStartedFilePath).existsSync()) {
      final String saveFileCompetitionModePath =
        p.join(rootDir, "game_dir/supertux/saves/competition-mode.stsg");

      if (File(saveFileCompetitionModePath).existsSync()) {
        File(saveFileCompetitionModePath).copySync(saveFilePath);
      }

      File(alreadyStartedFilePath).createSync();
    }

    String binName = "";
    if (Platform.isLinux) {
      binName = "supertux.AppImage";
    } else if (Platform.isWindows) {
      binName = "supertux2.exe";
    } else {
      // Unsupported platform;
    }
    final String binPath = p.join(rootDir, "game_dir/supertux/bin/$binName");

    var env = ShellEnvironment()..vars["SUPERTUX2_USER_DIR"] = userDir;
    var cshell = Shell(environment: env);
    cshell.run(binPath);

    FileWatcher fileWatcher = FileWatcher(
      saveFilePath,
      pollingDelay: const Duration(milliseconds: 1000),
    );
    DateTime lastRead = DateTime.now();
    fileWatcher.events.listen(
      (event) async {
        if (event.type == ChangeType.MODIFY) {
          DateTime lastWrite = File(saveFilePath).lastModifiedSync();
          if (lastWrite.isAfter(lastRead)) {
            lastRead = lastWrite;
            sendCompletedLevelsInfo(
                playerAccessCode, File(saveFilePath).readAsStringSync());
          }
        }
      },
    );
  } catch (e) {
    print(e);
  }
}

Future startTraining() async {
  final String rootDir = p.dirname(Platform.resolvedExecutable);
  final String userDir =
      (await Directory(p.join(rootDir, "game_dir/user_dir")).create()).path;
  final String profileDir =
      (await Directory(p.join(userDir, "profile1")).create()).path;
  final String saveFilePath = p.join(profileDir, "world1.stsg");

  final String saveFileTrainingModePath =
      p.join(rootDir, "game_dir/supertux/saves/training-mode.stsg");

  if (File(saveFileTrainingModePath).existsSync()) {
    File(saveFileTrainingModePath).copySync(saveFilePath);
  }

  String binName = "";
  if (Platform.isLinux) {
    binName = "supertux.AppImage";
  } else if (Platform.isWindows) {
    binName = "supertux2.exe";
  } else {
    // Unsupported platform;
  }
  final String binPath = p.join(rootDir, "game_dir/supertux/bin/$binName");

  var env = ShellEnvironment()..vars["SUPERTUX2_USER_DIR"] = userDir;
  shell = Shell(environment: env);
  shell.run(binPath);
}
