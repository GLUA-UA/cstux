import 'package:flutter/material.dart';

class Leaderboard extends StatelessWidget {
  const Leaderboard({Key? key, required this.entries}) : super(key: key);

  final List<DataRow> entries;

  @override
  Widget build(BuildContext context) {
    return DataTable(
      columns: const [
        // Nome do jogador
        DataColumn(
            label: Text('Nome do Jogador',
                style: TextStyle(fontWeight: FontWeight.bold))),
        // Mostra o tempo de jogo
        DataColumn(
            label:
                Text('Níveis', style: TextStyle(fontWeight: FontWeight.bold))),
        // n_nivel/n_total ou terminado se n_nivel = n_total
        DataColumn(
            label:
                Text('Estado', style: TextStyle(fontWeight: FontWeight.bold))),
        // Mostra o próximo nível ou -------------- se n_nivel = n_total
        DataColumn(
            label: Text('Próximo Nível',
                style: TextStyle(fontWeight: FontWeight.bold))),
      ],
      rows: entries,
    );
  }
}
