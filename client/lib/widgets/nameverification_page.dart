import 'package:flutter/material.dart';
import 'package:client/logic/game_handler.dart';

typedef TournamentStatusCallback = void Function(String tournamentStatus);

Widget nameVerificationPage(
    String title,
    String playerName,
    String playerId,
    TournamentStatusCallback updateTournamentStatus,
    PageController controller,
    BuildContext context) {
  return Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Text(
        title,
        textAlign: TextAlign.center,
        style: const TextStyle(
          fontSize: 30,
          fontWeight: FontWeight.bold,
        ),
      ),
      Expanded(
        child: Center(
          child: Text(
            "$playerName\n$playerId",
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 25,
            ),
          ),
        ),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          IconButton(
            icon: const Icon(Icons.close_outlined),
            onPressed: () => {
              controller.animateToPage(
                3,
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              )
            },
          ),
          const SizedBox(
            width: 30,
          ),
          IconButton(
            icon: const Icon(Icons.check_outlined),
            onPressed: () => {
              gameHandler(
                playerId,
                updateTournamentStatus,
              ),
              controller.nextPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              )
            },
          ),
        ],
      )
    ],
  );
}
