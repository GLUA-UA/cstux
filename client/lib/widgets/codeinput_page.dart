import 'package:flutter/material.dart';
import 'package:flutter_pin_code_fields/flutter_pin_code_fields.dart';
import 'package:flutter/services.dart';
import 'package:client/logic/requester.dart';
import 'package:http/http.dart' as http;

class UpperCaseTextFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    return TextEditingValue(
        text: newValue.text.toUpperCase(), selection: newValue.selection);
  }
}

typedef PlayerIdCallback = void Function(String playerId);
typedef PlayerNameCallback = void Function(String playerName);

Widget codeInputPage(
    String title,
    PlayerIdCallback updatePlayerId,
    PlayerNameCallback updatePlayerName,
    PageController controller,
    BuildContext context) {
  TextEditingController textEditingController = TextEditingController();

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
          child: PinCodeFields(
            length: 6,
            fieldBorderStyle: FieldBorderStyle.square,
            responsive: false,
            fieldHeight: 70.0,
            fieldWidth: 60.0,
            borderWidth: 2.0,
            activeBorderColor: Colors.black38,
            activeBackgroundColor: Colors.black12,
            fieldBackgroundColor: Colors.white,
            borderRadius: BorderRadius.circular(10.0),
            keyboardType: TextInputType.text,
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp('[a-zA-Z0-9]')),
              UpperCaseTextFormatter()
            ],
            autoHideKeyboard: false,
            animationDuration: const Duration(milliseconds: 100),
            borderColor: Colors.black12,
            textStyle: const TextStyle(
              fontSize: 30.0,
              fontWeight: FontWeight.normal,
            ),
            controller: textEditingController,
            onComplete: (output) async {
              controller.nextPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              );
              Future.delayed(const Duration(seconds: 1), () async {
                final http.Response response = await getPlayerFromId(output);
                if (200 == 200) {
                  //if (response.statusCode == 200) {
                  // TODO:
                  // playerName = response.body.name;
                  //playerName = "Teste";
                  //playerId = output.toUpperCase();
                  updatePlayerId(output.toUpperCase());
                  updatePlayerName("Name for testing");
                  controller.nextPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                } else {
                  controller.previousPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                }
                textEditingController.text = "";
              });
            },
          ),
        ),
      ),
    ],
  );
}
