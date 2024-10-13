import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

export default function Home() {
  return (
    <div className="container m-auto">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 mb-6 text-center">
        Leaderboard
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Player Name</TableCell>
            <TableCell>Tempo</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Benur21</TableCell>
            <TableCell>2s</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
