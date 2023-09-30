import 'dart:convert';
import 'package:http/http.dart' as http;

const String baseUrl = "http://192.168.1.5:3000";

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

Future<http.Response> getSaveFile(String id) async {
  try {
    return await http.get(Uri.parse('$baseUrl/player/$id/save'));
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}

Future<http.Response> sendSaveFile(String id, String saveFile) async {
  try {
    var uri = Uri.parse('$baseUrl/player/submit/$id');
    var request = http.MultipartRequest('POST', uri);
    var fileBytes = utf8.encode(saveFile);
    var stream = http.ByteStream.fromBytes(fileBytes);
    var multipartFile = http.MultipartFile('file', stream, fileBytes.length,
        filename: 'filename.txt');
    request.files.add(multipartFile);
    var response = await request.send();
    if (response.statusCode == 200) {
      return http.Response('{"success": "Sent"}', 200);
    } else {
      return http.Response('{"error": "Could not connect to server"}', 500);
    }
  } catch (e) {
    return http.Response('{"error": "Could not connect to server"}', 500);
  }
}
