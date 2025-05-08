'use client'
import { Button } from "@/src/components/ui/button";
import { DeleteUser } from "../(action)/user.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page()
 
{
      const router = useRouter()
    const handleDelete = async () => {
   
        try {
            await DeleteUser();
            toast("User deleted successfully!");
            setTimeout(() => {
                router.push(`/`);
              }, 2000);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Delete User</h1>
        <p className="mt-4 text-gray-600">Are you sure you want to delete this user?</p>
        <div className="mt-6">
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
        </div>
    );
}