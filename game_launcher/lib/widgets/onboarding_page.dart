import 'package:flutter/material.dart';

Widget onBoardingPage(
    String title, String text, PageController controller, BuildContext context,
    {bool nextButton = true, bool backButton = true}) {
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
            text,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 20,
            ),
          ),
        ),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          backButton
              ? IconButton(
                  icon: const Icon(Icons.arrow_back),
                  onPressed: () => {
                    controller.previousPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    )
                  },
                )
              : const SizedBox(
                  width: 30,
                ),
          const SizedBox(
            width: 30,
          ),
          nextButton
              ? IconButton(
                  icon: const Icon(Icons.arrow_forward),
                  onPressed: () => {
                    controller.nextPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    )
                  },
                )
              : const SizedBox(
                  width: 30,
                ),
        ],
      )
    ],
  );
}
