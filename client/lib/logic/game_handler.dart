import 'dart:io';
import 'package:path/path.dart' as p;
import 'package:process_run/shell.dart';

Future gameHandler() async {
  final String rootDir = p.dirname(Platform.resolvedExecutable);
  if (Platform.isLinux) {
    final String superTuxPath = p.join(rootDir, "supertux.AppImage");
    final String userDir =
        (await Directory(p.join(rootDir, "user_dir")).create()).path;

    var env = ShellEnvironment()..vars["SUPERTUX2_USER_DIR"] = userDir;
    var shell = Shell(environment: env);
    await shell.run(superTuxPath);
  } else if (Platform.isWindows) {
    final String superTuxPath = p.join(rootDir, "supertux.exe");
    var shell = Shell();
    await shell.run(superTuxPath);
  } else {
    // Unsupported platform
  }
}
