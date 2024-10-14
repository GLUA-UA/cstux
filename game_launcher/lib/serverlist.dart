import 'dart:convert';
import 'package:http/http.dart';

class Server {
  String name;
  String address;

  Server({required this.name, required this.address});

  factory Server.fromJson(Map<String, dynamic> json) {
    return Server(name: json['name'], address: json['address']);
  }

  Map<String, dynamic> toJson() {
    return {'name': name, 'address': address};
  }
}

class ServerList {
  List<Server> servers;

  ServerList({required this.servers});

  int get length {
    return servers.length;
  }

  factory ServerList.fromJson(List<dynamic> json) {
    List<Server> servers = [];
    for (var server in json) {
      servers.add(Server.fromJson(server));
    }
    return ServerList(servers: servers);
  }

  Map<String, dynamic> toJson() {
    List<Map<String, dynamic>> servers = [];
    for (var server in this.servers) {
      servers.add(server.toJson());
    }
    return {'servers': servers};
  }
}

Future<ServerList> getServerList() async {
  String serverList = "https://glua.ua.pt/supertux/server_list.json";
  ServerList servers = ServerList(servers: []);
  await get(Uri.parse(serverList)).then((response) {
    if (response.statusCode == 200) {
      servers = ServerList.fromJson(jsonDecode(response.body));
    }
  });
  return servers;
}

Future<bool> isServerOnline(String address) async {
  Response r = await get(Uri.parse("$address/api/ping"));
  if (r.statusCode == 200) {
    return true;
  }
  return false;
}
