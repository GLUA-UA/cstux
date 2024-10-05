import PlayerTable from "@/app/admin/players-table";
import LevelTable from "@/app/admin/levels-table";

export default function AdminDashboard() {
  return (
    <div className="container m-auto">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 mb-6 text-center">
        Administration Dashboard
      </h2>
      <div className="flex flex-row gap-6">
        <div className="basis-1/2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-6 text-center">
            Player Management
          </h3>
          <PlayerTable />
        </div>
        <div className="basis-1/2">
          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-6 text-center">
            Level List
          </h3>
          <LevelTable />
        </div>
      </div>
    </div>
  );
}
