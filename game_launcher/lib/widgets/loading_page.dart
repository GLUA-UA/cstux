import 'package:flutter/material.dart';

Widget loadingPage(
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
      const Expanded(
        child: Center(
          child: CircularProgressIndicator(
            color: Colors.orange,
          ),
        ),
      ),
    ],
  );
}
