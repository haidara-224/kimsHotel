'use client'

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { Button } from "../button"
import { cn } from "@/src/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../command"

const villesGuinee = [
  "Beyla", "Boffa", "Boké", "Conakry", "Coyah", "Dabola", "Dalaba", "Dinguiraye",
  "Dubréka", "Faranah", "Forécariah", "Fria", "Gaoual", "Guéckédou", "Kankan",
  "Kérouané", "Kindia", "Kissidougou", "Koubia", "Koundara", "Kouroussa", "Labé",
  "Lélouma", "Lola", "Macenta", "Mandiana", "Mali", "Mamou", "Nzérékoré", "Pita",
  "Siguiri", "Télimélé", "Timbo", "Tougué", "Yomou"
]

export function CitySelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            "border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-gray-200",
            "hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          {value
            ? villesGuinee.find((ville) => ville === value)
            : "Sélectionnez une ville..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-[300px] p-0",
          "bg-white dark:bg-gray-800",
          "border-gray-200 dark:border-gray-700"
        )}
      >
        <Command>
          <CommandInput 
            placeholder="Rechercher une ville..." 
            className={cn(
              "border-b border-gray-200 dark:border-gray-700",
              "focus:ring-0 focus:border-gray-300 dark:focus:border-gray-600"
            )}
          />
          <CommandEmpty className="py-5 text-center text-gray-500 dark:text-gray-400">
            Aucune ville trouvée.
          </CommandEmpty>
          <CommandGroup className="max-h-[400px] overflow-y-auto">
            {villesGuinee.map((ville) => (
              <CommandItem
                key={ville}
                value={ville}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
                className={cn(
                  "cursor-pointer",
                  "text-gray-900 dark:text-gray-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    "text-blue-600 dark:text-blue-400",
                    value === ville ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="flex-1">{ville}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}