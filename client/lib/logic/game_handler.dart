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
  String playerId,
  TournamentStatusCallback updateGameStatus,
) async {
  Timer.periodic(
    const Duration(milliseconds: 500),
    (timer) async {
      final http.Response response = await getTournamentStatus();
      if (response.statusCode == 200) {
        Map<String, dynamic> srlResponse = jsonDecode(response.body);
        if (srlResponse['success'] == true &&
            srlResponse['tournamentStarted'] == true) {
          timer.cancel();
          updateGameStatus("c");
          if (shell != null) {
            shell.kill();
          }
          await startGame(playerId);
        } else {
          updateGameStatus("t");
        }
      }
    },
  );
}

Future startGame(String playerId) async {
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
  //

  try {
    final String rootDir = p.dirname(Platform.resolvedExecutable);
    final String userDir =
        (await Directory(p.join(rootDir, "game_dir/user_dir")).create()).path;
    final String saveFilePath = p.join(userDir, "profile1/world1.stsg");

    final http.Response response = await getSaveFile(playerId);
    if (response.statusCode == 200) {
      await File(saveFilePath).create(recursive: true);
      File(saveFilePath).writeAsBytesSync(response.bodyBytes);
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
      pollingDelay: const Duration(milliseconds: 500),
    );
    fileWatcher.events.listen(
      (event) {
        if (event.type == ChangeType.MODIFY) {
          sendSaveFile(playerId, File(saveFilePath).readAsStringSync());
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
  final String saveFilePath = p.join(userDir, "profile1/world1.stsg");

  final http.Response response = await getSaveFile("000000");
  if (response.statusCode == 200) {
    await File(saveFilePath).create(recursive: true);
    File(saveFilePath).writeAsBytesSync(response.bodyBytes);
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
