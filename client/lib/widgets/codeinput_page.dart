import 'package:flutter/material.dart';

Widget codeInputPage(String title, BuildContext context) {
  final List<FocusNode> focusNodes = List.generate(7, (index) => FocusNode());
  final List<TextEditingController> controllers =
      List.generate(6, (index) => TextEditingController());

  return Builder(builder: (BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(focusNodes[0]);
    });
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
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                digitInput(
                    context, controllers[0], focusNodes[0], focusNodes[1]),
                digitInput(
                    context, controllers[1], focusNodes[1], focusNodes[2]),
                digitInput(
                    context, controllers[2], focusNodes[2], focusNodes[3]),
                const Text(
                  "-",
                  style: TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                digitInput(
                    context, controllers[3], focusNodes[3], focusNodes[4]),
                digitInput(
                    context, controllers[4], focusNodes[4], focusNodes[5]),
                digitInput(
                    context, controllers[5], focusNodes[5], focusNodes[6]),
              ],
            ),
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                for (int i = 0; i < 6; i++) {
                  controllers[i].clear();
                }
                FocusScope.of(context).requestFocus(focusNodes[0]);
              },
            ),
            const SizedBox(
              width: 30,
            ),
            IconButton(
              focusNode: focusNodes[6],
              icon: const Icon(Icons.arrow_forward),
              onPressed: () {
                String code = "";
                for (int i = 0; i < 6; i++) {
                  if (controllers[i].text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Código inválido!"),
                      ),
                    );
                    for (int j = 0; j < i; j++) {
                      controllers[j].clear();
                    }
                    FocusScope.of(context).requestFocus(focusNodes[0]);
                    return;
                  }
                  code += controllers[i].text;
                }
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(code),
                  ),
                );
              },
            ),
          ],
        )
      ],
    );
  });
}

Widget digitInput(BuildContext context, TextEditingController controller,
    FocusNode currentFocus, FocusNode? nextFocus) {
  return StatefulBuilder(
    builder: (BuildContext context, StateSetter setState) {
      currentFocus.addListener(() {
        setState(() {});
      });

      return Container(
        height: 70,
        width: 60,
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.black38,
            width: currentFocus.hasFocus ? 2.5 : 1,
          ),
          borderRadius: BorderRadius.circular(10),
        ),
        child: TextField(
          controller: controller,
          focusNode: currentFocus,
          maxLength: 1,
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 30,
            fontWeight: FontWeight.normal,
          ),
          onChanged: (value) {
            if (value.isNotEmpty && nextFocus != null) {
              FocusScope.of(context).requestFocus(nextFocus);
            }
          },
          cursorColor: Colors.transparent,
          cursorWidth: 0,
          decoration: const InputDecoration(
            counterText: "",
            border: InputBorder.none,
          ),
        ),
      );
    },
  );
}
