import CategoryTable from "@/src/components/ui/Dashboard/CategoryTable";
import { ChartDashboard } from "@/src/components/ui/Dashboard/ChartDashboard";
import { CountDashboard } from "@/src/components/ui/Dashboard/CoutDashboard";



export default function Page() {
   
    return (
        <>
         <div className="grid grid-cols-1 items-center  lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-5">
            <CountDashboard/>
        </div>
        <div className="w-full">
            <ChartDashboard/>           
        </div>
        <div>
            <CategoryTable/>
        
        </div>
        </>
       
    );
}
