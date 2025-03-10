import { Suspense } from "react";
import { getLogement } from "@/app/(action)/Logement.action";
import SkeletonTable from "@/src/components/ui/Dashboard/skeletonTbale";

async function DataTable() {
  const data = await getLogement();
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex bg-gray-100 p-3">
        <div className="w-1/4">ID</div>
        <div className="w-1/2">Name</div>
        <div className="w-1/4">Email</div>
      </div>
      {data.map((item) => (
        <div key={item.id} className="flex p-3 border-t">
          <div className="w-1/4">{item.id}</div>
          <div className="w-1/2">{item.nom}</div>
          <div className="w-1/4">{item.email}</div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SkeletonTable />}>
      <DataTable />
    </Suspense>
  );
}
