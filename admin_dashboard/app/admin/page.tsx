import CreateUserDialog from "@/components/create-user-dialog";




export default function Home() {

  return (
    <div className="container m-auto">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mt-6 mb-6 text-center">
        Administration Dashboard
      </h2>
      <CreateUserDialog />
    </div>
  );
}
