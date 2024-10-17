import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:client/logic/supertux_savegame.dart';

String baseUrl = "http://localhost:3000";

void setBaseUrl(String newUrl) {
  baseUrl = newUrl;
}

Future<http.Response> getPlayerFromAccessCode(String accessCode) async {
  try {
    return await http.post(
      Uri.parse('$baseUrl/api/users/sign-in'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'accessCode': accessCode,
      }),
    );
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}

Future<http.Response> getTournamentStatus() async {
  try {
    return await http.get(Uri.parse('$baseUrl/api/state/tournamentStarted'));
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}

List<String> alreadySendLevels = [];

void sendCompletedLevelsInfo(String accessCode, String saveFile) {
  Map<String, dynamic> saveData = parseSuperTuxSavegame(saveFile);
  Map<String, dynamic> levels = saveData['supertux-savegame']['state']['worlds']
      ['/levels/world1/worldmap.stwm']['levels'];
  Map<String, dynamic> completedLevels = {};
  levels.forEach((key, value) {
    if (key == 'intro.stl') return;
    if (value['solved'] == "true" && !alreadySendLevels.contains(key)) {
      completedLevels[key] = {
        'time': value['statistics']['time-needed'],
        'coins': value['statistics']['coins-collected'],
      };
    }
  });

  if (completedLevels.isNotEmpty) {
    // Send the completed levels one at a time to the server
    completedLevels.forEach((key, value) async {
      try {
        await http.post(
          Uri.parse('$baseUrl/api/submit'),
          headers: <String, String>{
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: jsonEncode(<String, dynamic>{
            'accessCode': accessCode,
            'levelInfo': {
              'levelId': key,
              'time': value['time'],
              'coins': value['coins'],
            }
          }),
        );
        alreadySendLevels.add(key);
      } catch (e) {
        print('Could not send level completion info for $key');
      }
    });
  }
}
