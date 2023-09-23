import 'package:flutter/material.dart';
import 'package:flutter_pin_code_fields/flutter_pin_code_fields.dart';
import 'package:flutter/services.dart';
import 'package:client/logic/requester.dart';
import 'package:http/http.dart' as http;

void showLoadingDialog(BuildContext context) {
  showDialog(
    context: context,
    barrierDismissible: false,
    builder: (BuildContext context) {
      return AlertDialog(
        content: Row(
          children: [
            CircularProgressIndicator(),
            SizedBox(width: 20.0),
            Text("Please wait..."),
          ],
        ),
      );
    },
  );
}

Widget codeInputPage(
    String title, PageController controller, BuildContext context) {
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
            onComplete: (output) async {
              showLoadingDialog(context);
              try {
                http.Response response = await getNameFromCode();
                if (response.statusCode == 200) {
                  print(response.body);
                  // Validation logic
                  bool isValid = true;
                  if (isValid) {
                    controller.nextPage(
                        duration: const Duration(milliseconds: 500),
                        curve: Curves.ease);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text('Invalid code, please try again')));
                  }
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Failed to fetch data from API')));
                }
              } catch (e) {
                print('Error occurred: $e');
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('An error occurred while fetching data')));
              } finally {
                Navigator.of(context).pop();
              }
            },
          ),
        ),
      ),
    ],
  );
}
