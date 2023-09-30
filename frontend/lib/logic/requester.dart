import 'package:http/http.dart' as http;

const String baseUrl = "http://localhost:3000";

Future<http.Response> getLeaderboard() async {
  try {
    return await http.get(Uri.parse('$baseUrl/tournament/players'));
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}
