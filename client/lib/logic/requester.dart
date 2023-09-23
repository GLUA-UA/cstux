import 'package:http/http.dart' as http;

Future<http.Response> getNameFromCode() {
  return http.get(Uri.parse('https://jsonplaceholder.typicode.com/albums/1'));
}
