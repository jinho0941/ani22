'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Props = {
  list: { value: string; label: string }[]
  value: string
  setValue: (value: string) => void
  onSelected?: (value: string) => void
}

export function Combobox({ list, value, setValue, onSelected }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[120px] justify-between'
        >
          {value
            ? list.find((item) => item.value === value)?.label
            : 'Select value...'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[120px] p-0'>
        <Command>
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  className='cursor-pointer'
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    if (currentValue === value) {
                      setOpen(false)
                      return
                    }
                    setValue(currentValue)
                    setOpen(false)
                    if (onSelected) {
                      onSelected(currentValue)
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
