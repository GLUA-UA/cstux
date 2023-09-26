import 'dart:io';
import 'dart:async';
import 'dart:convert';
import 'package:path/path.dart' as p;
import 'package:http/http.dart' as http;
import 'package:process_run/shell.dart';
import 'package:client/logic/requester.dart';

Future gameHandler() async {
  Timer gameSense = Timer.periodic(
    Duration(milliseconds: 500),
    (timer) async {
      final http.Response response = await getTournamentStatus();
      if (response.statusCode == 200) {
        Map<String, dynamic> srlResponse = jsonDecode(response.body);
        if (srlResponse['success'] == true &&
            srlResponse['tournamentStarted'] == true) {
          timer.cancel();
          await startGame();
        }
      }
    },
  );
}

Future startGame() async {
  final String rootDir = p.dirname(Platform.resolvedExecutable);
  if (Platform.isLinux) {
    final String superTuxPath = p.join(rootDir, "supertux.AppImage");
    final String userDir =
        (await Directory(p.join(rootDir, "user_dir")).create()).path;

    var env = ShellEnvironment()..vars["SUPERTUX2_USER_DIR"] = userDir;
    var shell = Shell(environment: env);
    shell.run(superTuxPath);
  } else if (Platform.isWindows) {
    final String superTuxPath = p.join(rootDir, "supertux.exe");
    var shell = Shell();
    shell.run(superTuxPath);
  }
}

/*
  final String rootDir = p.dirname(Platform.resolvedExecutable);
  if (Platform.isLinux) {
    final String superTuxPath = p.join(rootDir, "supertux.AppImage");
    final String userDir =
        (await Directory(p.join(rootDir, "user_dir")).create()).path;

    var env = ShellEnvironment()..vars["SUPERTUX2_USER_DIR"] = userDir;
    var shell = Shell(environment: env);
    shell.run(superTuxPath);
    //await Future.delayed(Duration(seconds: 2));
    //shell.kill();
  } else if (Platform.isWindows) {
    final String superTuxPath = p.join(rootDir, "supertux.exe");
    var shell = Shell();
    shell.run(superTuxPath);
  } else {
    // Unsupported platform
  }
  */