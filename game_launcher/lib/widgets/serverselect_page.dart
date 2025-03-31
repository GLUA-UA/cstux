import 'package:flutter/material.dart';
import 'package:client/logic/requester.dart';
import 'package:client/serverlist.dart';

Widget serverSelectPage(
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
          child: FutureBuilder<ServerList>(
            future: getServerList(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Center(
                  child: ListView.builder(
                    itemCount: snapshot.data!.servers.length,
                    itemBuilder: (context, index) {
                      String serverName = snapshot.data!.servers[index].name;
                      String serverAddress = snapshot.data!.servers[index].address;
                      return FutureBuilder(
                        future: isServerOnline(serverAddress),
                        builder: (context, snapshot) {
                          if (snapshot.hasData) {
                            return ListTile(
                              title: Text(serverName),
                              subtitle: Text(serverAddress),
                              trailing: snapshot.data == true
                                  ? const Icon(Icons.check, color: Colors.green)
                                  : const Icon(Icons.close, color: Colors.red),
                              onTap: snapshot.data == false ? null : () {
                                setBaseUrl(serverAddress);
                                controller.nextPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.easeInOut,
                                );
                              },
                            );
                          } else if (snapshot.hasError) {
                            return ListTile(
                              title: Text(serverName),
                              subtitle: Text(serverAddress),
                              trailing: const Icon(Icons.close, color: Colors.red),
                            );
                          }
                          return ListTile(
                            title: Text(serverName),
                            subtitle: Text(serverAddress),
                            trailing: const CircularProgressIndicator(),
                          );
                        },
                      );
                    },
                  ),
                );
              } else if (snapshot.hasError) {
                return const Text("Could not connect to server list");
              }
              return const CircularProgressIndicator();
            },
          ),
        ),
      ),
      Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => {
              controller.previousPage(
                duration: const Duration(milliseconds: 300),
                curve: Curves.easeInOut,
              )
            },
          ),
          const SizedBox(
            width: 30,
          ),
          const SizedBox(
            width: 30,
          ),
        ],
      )
    ],
  );
}
