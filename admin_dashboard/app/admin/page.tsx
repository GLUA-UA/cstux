import PlayerTable from "@/app/admin/players-table";

export default function AdminDashboard() {
  return (
    <div className="container m-auto">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 mb-3 text-center">
        Administration Dashboard
      </h2>

      <PlayerTable />
    </div>
  );
}
