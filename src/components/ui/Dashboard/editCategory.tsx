"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../alert-dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { useToast } from "@/src/hooks/use-toast";
import { UpdateCategory } from "@/app/(action)/category.action";
import { useEffect } from "react";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    id: string;
    name: string;
    description?: string | null;
    urlImage: string;
  } | null;
  refresh:()=>void
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Ce Champs est requis" }),
  description: z.string().min(1, { message: "Ce Champs est requis" }),
});

export default function EditCategoryModal({ open, onOpenChange, category,refresh }: EditCategoryModalProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
      });
    }
  }, [category, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!category?.id) return;
    try{
      await UpdateCategory(category.id, data.name, data.description);
      toast({
        title: "Modification de la catégorie",
        description: "Catégorie modifiée avec succès.",
      });
    
      onOpenChange(false);
       refresh()
    }catch(e){
      console.log(e)
    }
   
  };

  const { isSubmitting } = form.formState;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Édition</AlertDialogTitle>
          <AlertDialogDescription>
            Modifiez les informations de la catégorie ci-dessous.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Nom
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-slate-100 dark:bg-slate-500 border h-14 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                      placeholder="Nom"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                    
                      className="bg-slate-100 dark:bg-slate-500 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 h-72 border"
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <Button type="submit" className="dark:bg-slate-800 dark:text-white" disabled={isSubmitting}>
                {isSubmitting ? "En cours de Sauvegarde..." : "Sauvegarder"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
