'use client'
import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { CategoryLogement } from "@/types/types";
import { DeleteCategory, getCategory } from "@/app/(action)/category.action";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../button";
import EditCategoryModal from "./editCategory";
import { userIsSuperAdmin } from "@/app/(action)/user.action";



interface CategoryTableProps {
  title?: string,
  limit?: number

}
export default function CategoryTable({ title, limit }: CategoryTableProps) {
  const [category, setCategory] = useState<CategoryLogement[]>([])
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryLogement | null>(null);
  const [isSuperAdmin,setIsSuperAdmin]=useState(false)

  const chechIsSuperAdmin =async()=>{
    const isSuper=await userIsSuperAdmin()
    
    setIsSuperAdmin(isSuper)
    
  }
  const fetchData = useCallback(async () => {
    const data = await getCategory();
    setCategory(limit ? (data as CategoryLogement[]).slice(0, limit) : (data as CategoryLogement[]));
  }, [limit]);
 
  useEffect(() => {
    chechIsSuperAdmin()
    fetchData();

  }, [fetchData])

  const HanddleEdit=(ct:CategoryLogement)=>{
    setSelectedCategory(ct)
    
    setModalOpen(true)
  }
  const deleteCategories = async (ct:CategoryLogement) => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette Catégorie ?")

    if (confirmed) {
     
        await DeleteCategory(ct.id as string)
    }
    fetchData()
  };
  
  
  return (
    <div className="mt-10 overflow-x-auto">
      <h3 className="text-2xl mb-4 font-semibold">{title ?? "Category Logement"}</h3>
      <Table className="min-w-full">
        <TableCaption>Liste des Logements et Hôtels</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead >Description</TableHead>
            <TableHead >Image</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {category.map((ct) => (
            <TableRow key={ct.id}>
              <TableCell>{ct.id}</TableCell>
              <TableCell>{ct.name}</TableCell>
              <TableCell>
                {ct.description
                  ? ct.description.split(' ').slice(0, 10).join(' ') + (ct.description.split(' ').length > 5 ? '...' : '')
                  : ''
                }
              </TableCell>

              <TableCell > 
                {
                  ct.urlImage ? <Image src={`/${ct.urlImage}`} alt={ct.name} width={32} height={32} className="dark:bg-white" />
                  : <>-----</>
                }
              </TableCell>
              <TableCell className="flex gap-3">
                <Button onClick={() => HanddleEdit(ct)}><Edit2 /></Button>
        
                <EditCategoryModal open={modalOpen} onOpenChange={setModalOpen} category={selectedCategory} refresh={fetchData}/>
                {
                  isSuperAdmin &&
                <Button className="bg-red-600" onClick={() => deleteCategories(ct)} disabled={!isSuperAdmin}> <Trash2 className="text-white rounded text-xl hover:text-red-800 transition-all cursor-pointer" /></Button>

                }
               
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </div>
  )
}