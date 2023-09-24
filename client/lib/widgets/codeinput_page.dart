import 'package:flutter/material.dart';
import 'package:flutter_pin_code_fields/flutter_pin_code_fields.dart';
import 'package:flutter/services.dart';
import 'package:client/logic/requester.dart';
import 'package:http/http.dart' as http;

Widget codeInputPage(
    String title, PageController controller, BuildContext context) {
  TextEditingController textEditingController = TextEditingController();
  textEditingController.text = "";

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
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
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
                if (response.statusCode == 200) {
                  controller.nextPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                } else {
                  controller.previousPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                  );
                  textEditingController.text = "";
                }
              });
            },
          ),
        ),
      ),
    ],
  );
}
