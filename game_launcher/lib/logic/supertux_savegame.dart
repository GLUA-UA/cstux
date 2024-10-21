Map<String, dynamic> parseSuperTuxSavegame(String saveData) {
  List<String> lines = saveData.split('\n').map((line) => line.trim()).toList();
  Map<String, dynamic> jsonObj = {};
  Map<String, dynamic> currentObject = jsonObj;
  List<Map<String, dynamic>> stack = [];

  void addToCurrentObject(String key, dynamic value) {
    if (currentObject is List) {
      (currentObject as List).add({key: value});
    } else {
      currentObject[key] = value;
    }
  }

  dynamic parseValue(String value) {
    if (value == '#t') return "true";
    if (value == '#f') return "false";
    if (double.tryParse(value) != null) return double.parse(value).toString();
    return value.replaceAll('"', ''); // Remove quotes from strings
  }

  for (String line in lines) {
    if (line.startsWith('(')) {
      RegExpMatch? match = RegExp(r'\(([^ ]+)').firstMatch(line);
      if (match != null) {
        String key = match.group(1)!.replaceAll('"', ''); // Extract the key
        if (line.endsWith(')')) {
          // (key value)
          RegExpMatch? valueMatch =
              RegExp(r'\(([^ ]+) ([^)]+)\)').firstMatch(line);
          if (valueMatch != null) {
            String value = valueMatch.group(2)!; // Extract the value
            value = parseValue(value);
            addToCurrentObject(key, value);
          }
        } else {
          // Start of a new object
          Map<String, dynamic> newObject = {};
          addToCurrentObject(key, newObject);
          stack.add(currentObject);
          currentObject = newObject;
        }
      }
    } else if (line == ')') {
      // End of an object
      currentObject = stack.removeLast();
    } else {
      // key value within the object
      List<String> parts = line.split(' ');
      if (parts.length != 2) continue;
      String key = parts[0];
      String value = parts[1];
      addToCurrentObject(key, parseValue(value));
    }
  }

  return jsonObj;
}
