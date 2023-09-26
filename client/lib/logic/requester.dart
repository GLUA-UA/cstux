import 'package:http/http.dart' as http;

const String baseUrl = "http://localhost:3000";

Future<http.Response> getPlayerFromId(String id) async {
  try {
    return await http.get(Uri.parse('$baseUrl/player/$id'));
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}

Future<http.Response> getTournamentStatus() async {
  try {
    return await http.get(Uri.parse('$baseUrl/tournament'));
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}
