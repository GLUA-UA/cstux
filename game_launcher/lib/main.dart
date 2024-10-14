import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:client/widgets/ongame_page.dart';
import 'package:client/widgets/loading_page.dart';
import 'package:client/widgets/codeinput_page.dart';
import 'package:window_manager/window_manager.dart';
import 'package:client/widgets/onboarding_page.dart';
import 'package:client/widgets/serverselect_page.dart';
import 'package:client/widgets/nameverification_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await windowManager.ensureInitialized();

  WindowOptions windowOptions = const WindowOptions(
    minimumSize: Size(900, 550),
    title: "Torneio de SuperTux - GLUA",
    center: true,
  );
  windowManager.waitUntilReadyToShow(windowOptions, () async {
    await windowManager.show();
    await windowManager.focus();
  });

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.orange),
        useMaterial3: true,
      ),
      home: const PageHolder(title: "Torneio de SuperTux - GLUA"),
    );
  }
}

class PageHolder extends StatefulWidget {
  const PageHolder({super.key, required this.title});

  final String title;

  @override
  State<PageHolder> createState() => _PageHolderState();
}

class _PageHolderState extends State<PageHolder> {
  final PageController controller = PageController(initialPage: 0);

  String playerName = "";
  void updateName(String newName) {
    setState(() {
      playerName = newName;
    });
  }

  String playerId = "";
  void updatePlayerId(String newPlayerId) {
    setState(() {
      playerId = newPlayerId;
    });
  }

  // t - trainning; c - competition; f - finnished
  String tournamentStatus = "t";
  void updateTournamentStatus(String newStatus) {
    setState(() {
      tournamentStatus = newStatus;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: 800,
          height: 400,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.black12,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SvgPicture.asset(
                    "assets/images/glua_logo.svg",
                    fit: BoxFit.contain,
                    height: 70,
                  )
                ],
              ),
              const SizedBox(
                height: 5,
              ),
              Expanded(
                child: PageView(
                  physics: const NeverScrollableScrollPhysics(),
                  controller: controller,
                  children: [
                    onBoardingPage(
                      "Bem-vindo ao Torneio de SuperTux",
                      "O torneio de SuperTux é um torneio onde os participantes competem entre si para chegar ao fim do jogo o mais rápido possível.",
                      backButton: false,
                      controller,
                      context,
                    ),
                    onBoardingPage(
                      "Para que serve este programa?",
                      "Este programa serve para que os participantes possam enviar os seus tempos de jogo para o servidor, para que possam ser comparados com os tempos dos outros participantes.",
                      controller,
                      context,
                    ),
                    onBoardingPage(
                      "Que dados são enviados?",
                      "São enviados apenas o nome do jogador e, periodicamente, os saves do jogo, para que seja possível verificar em que nível o jogador se encontra.",
                      controller,
                      context,
                    ),
                    serverSelectPage(
                      "Seleciona o servidor",
                      controller,
                      context,
                    ),
                    codeInputPage(
                      "Código de acesso",
                      (String newPlayerId) => updatePlayerId(newPlayerId),
                      (String newName) => updateName(newName),
                      controller,
                      context,
                    ),
                    loadingPage(
                      "Tou? Estás-me a oubir? ...",
                      controller,
                      context,
                    ),
                    nameVerificationPage(
                      "É este o teu nome?",
                      playerName,
                      playerId.toString(),
                      (String newStatus) => updateTournamentStatus(newStatus),
                      controller,
                      context,
                    ),
                    onGamePage(
                      tournamentStatus,
                      controller,
                      context,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}