import LeaderTable from "@/app/leaderboard/leader-table";

export default function Leaderboard() {
  return (
    <div className="container m-auto mb-16">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 mb-6 text-center">
        Leaderboard
      </h2>
      <LeaderTable />
    </div>
  );
}
