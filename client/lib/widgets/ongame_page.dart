import 'package:flutter/material.dart';
import 'package:client/logic/game_handler.dart';

Widget onGamePage(
    String tournamentStatus, PageController controller, BuildContext context) {
  String title = "";
  String text = "";

  if (tournamentStatus == "t") {
    title = "Aguarda...";
    text =
        "O torneio ainda não começou. Enquanto isso, podes treinar e personalizar as configurações do jogo!";
  } else if (tournamentStatus == "c") {
    title = "A Competir!";
    text =
        "O torneio já começou! Não te esqueças de verificar a leaderboard para veres a tua posição!";
  } else if (tournamentStatus == "f") {
    title = "Concluíste o Torneio!";
    text = "Parabéns! Esperamos que tenhas gostado da experiência!";
  }

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
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Expanded(
              child: Center(
                child: Text(
                  text,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 20,
                  ),
                ),
              ),
            ),
            tournamentStatus == "t"
                ? FilledButton(
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(
                        Colors.orange,
                      ),
                      padding: MaterialStateProperty.all<EdgeInsets>(
                        const EdgeInsets.all(20),
                      ),
                    ),
                    onPressed: startTraining,
                    child: const Text(
                      'Iniciar em Modo Treino',
                      style: TextStyle(
                        fontSize: 15,
                      ),
                    ),
                  )
                : const SizedBox(),
          ],
        ),
      ),
    ],
  );
}
