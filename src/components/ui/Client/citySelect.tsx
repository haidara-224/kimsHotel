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
          className="w-full justify-between"
        >
          {value
            ? villesGuinee.find((ville) => ville === value)
            : "Sélectionnez une ville..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher une ville..." />
          <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {villesGuinee.map((ville) => (
              <CommandItem
                key={ville}
                value={ville}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === ville ? "opacity-100" : "opacity-0"
                  )}
                />
                {ville}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}