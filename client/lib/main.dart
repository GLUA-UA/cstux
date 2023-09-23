import 'package:client/widgets/codeinput_page.dart';
import 'package:client/widgets/onboarding_page.dart';
import 'package:client/widgets/nameverification_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

void main() {
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
      home: const OnBoarding(title: 'Torneio de Super Tux - GLUA'),
    );
  }
}

class OnBoarding extends StatefulWidget {
  const OnBoarding({super.key, required this.title});

  final String title;

  @override
  State<OnBoarding> createState() => _OnBoardingState();
}

class _OnBoardingState extends State<OnBoarding> {
  final PageController _controller = PageController(initialPage: 0);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          width: 600,
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  SvgPicture.asset(
                    "assets/images/enei_logo.svg",
                    fit: BoxFit.contain,
                    height: 100,
                  ),
                  SvgPicture.asset(
                    "assets/images/glua_logo.svg",
                    fit: BoxFit.contain,
                    height: 70,
                  ),
                ],
              ),
              const SizedBox(
                height: 5,
              ),
              Expanded(
                child: PageView(
                  physics: const NeverScrollableScrollPhysics(),
                  controller: _controller,
                  children: [
                    onBoardingPage(
                      "Bem-vindo ao Torneio de Super Tux",
                      "O torneio de Super Tux é um torneio onde os participantes competem entre si para chegar ao fim do jogo o mais rápido possível.",
                      _controller,
                      context,
                    ),
                    onBoardingPage(
                      "Para que serve este programa?",
                      "Este programa serve para que os participantes possam enviar os seus tempos de jogo para o servidor, para que possam ser comparados com os tempos dos outros participantes.",
                      _controller,
                      context,
                    ),
                    onBoardingPage(
                      "Que dados são enviados?",
                      "São enviados apenas o nome do jogador e, periodicamente, os saves do jogo, para que seja possível verificar em que nível o jogador se encontra.",
                      _controller,
                      context,
                    ),
                    codeInputPage(
                      "Código de acesso",
                      _controller,
                      context,
                    ),
                    nameVerificationPage(
                      "É este o teu nome?",
                      _controller,
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
