import 'package:http/http.dart' as http;

Future<http.Response> getPlayerFromId(String id) async {
  try {
    return await http.get(Uri.parse('http://localhost:8080/player/$id'));
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}
