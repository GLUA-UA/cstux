import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_svg/flutter_svg.dart';
import 'package:frontend/logic/requester.dart';
import 'package:frontend/widgets/leaderboard.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Super Tux Leaderboard'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  late Timer _timer;
  List<DataRow> leaderboardEntries = [];

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(
      const Duration(milliseconds: 2500),
      (timer) async {
        final http.Response response = await getLeaderboard();

        if (response.statusCode == 200) {
          Map<String, dynamic> srlResponse = jsonDecode(response.body);
          if (srlResponse['success'] == true) {
            List<DataRow> newEntries = [];

            // Sort the players by levelsCompleted in descending order
            List<dynamic> sortedPlayers = List.from(srlResponse['players']);
            sortedPlayers.sort(
                (a, b) => b['levelsCompleted'].compareTo(a['levelsCompleted']));

            // Slice the list to get the first 10 players
            var topPlayers = sortedPlayers.length > 10
                ? sortedPlayers.sublist(0, 10)
                : sortedPlayers;

            for (var player in topPlayers) {
              var estado =
                  player['endedTournament'] ? "Terminado" : "Em progreso";
              newEntries.add(
                DataRow(
                  cells: [
                    DataCell(Text(player['name'])),
                    DataCell(
                        Text('${player['levelsCompleted'].toString()}/23')),
                    DataCell(Text(estado)),
                    DataCell(Text(player['nextLevel'])),
                  ],
                ),
              );
            }
            setState(() {
              leaderboardEntries = newEntries;
            });
          } else {
            // Handle the error here. For now, just print it
            print('Failed to load leaderboard: ${srlResponse['error']}');
          }
        } else {
          // Handle the error here. For now, just print it
          print('Failed to load leaderboard: ${response.statusCode}');
        }
      },
    );
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Center(
            child: Column(
              children: [
                Container(
                  width: 600,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      SvgPicture.asset(
                        "/images/enei_logo.svg",
                        fit: BoxFit.contain,
                        height: 100,
                      ),
                      SvgPicture.asset(
                        "/images/glua_logo.svg",
                        fit: BoxFit.contain,
                        height: 70,
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                Leaderboard(
                  entries: leaderboardEntries,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
