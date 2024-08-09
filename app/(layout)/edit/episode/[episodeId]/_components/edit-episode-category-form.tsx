'use client'

import { ChevronsUpDown, X } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { updateEpisode } from '@/app/action/episode'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Episode } from '@prisma/client'

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
import { useRouter } from 'next/navigation'

type Props = {
  episode: Episode
}

const categoryOptions = [
  { value: 'action', label: '액션' },
  { value: 'adventure', label: '모험' },
  { value: 'comedy', label: '코미디' },
  { value: 'drama', label: '드라마' },
  { value: 'fantasy', label: '판타지' },
  { value: 'horror', label: '공포' },
  { value: 'mystery', label: '미스터리' },
  { value: 'psychological', label: '심리' },
  { value: 'romance', label: '로맨스' },
  { value: 'sci-fi', label: 'SF' },
  { value: 'slice-of-life', label: '일상' },
  { value: 'sports', label: '스포츠' },
  { value: 'supernatural', label: '초자연' },
  { value: 'thriller', label: '스릴러' },
  { value: 'mecha', label: '메카' },
  { value: 'isekai', label: '이세계' },
  { value: 'historical', label: '역사' },
  { value: 'military', label: '군사' },
  { value: 'music', label: '음악' },
  { value: 'parody', label: '패러디' },
]

export const EditEpisodeCategoryForm = ({ episode }: Props) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    episode.categories || [],
  )
  const [open, setOpen] = useState(false)

  const isDisabled =
    JSON.stringify(selectedCategories) === JSON.stringify(episode.categories)

  const addCategory = (category: string) => {
    const categoryLabel = categoryOptions.find(
      (item) => item.value === category,
    )?.label
    if (categoryLabel && !selectedCategories.includes(categoryLabel)) {
      setSelectedCategories([...selectedCategories, categoryLabel])
      setOpen(false)
    }
  }

  const removeCategory = (category: string) => {
    const updatedCategories = selectedCategories.filter(
      (cat) => cat !== category,
    )
    setSelectedCategories(updatedCategories)
  }

  const onSubmit = () => {
    startTransition(async () => {
      const action = await updateEpisode({
        episodeId: episode.id,
        categories: selectedCategories,
      })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.refresh()
    })
  }

  return (
    <div className='space-y-2'>
      <div className='space-y-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'
            >
              {selectedCategories.length > 0
                ? selectedCategories[selectedCategories.length - 1]
                : '카테고리 선택...'}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandList>
                <CommandEmpty>Not found.</CommandEmpty>
                <CommandGroup>
                  {categoryOptions.map((item) => (
                    <CommandItem
                      className={`cursor-pointer ${
                        selectedCategories.includes(item.label)
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        if (!selectedCategories.includes(item.label)) {
                          addCategory(currentValue)
                        }
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <div className='flex flex-wrap gap-2'>
          {selectedCategories.map((category) => (
            <Badge key={category} className='flex items-center space-x-1'>
              <span>{category}</span>
              <X
                className='cursor-pointer'
                onClick={() => removeCategory(category)}
              />
            </Badge>
          ))}
        </div>
      </div>
      {!isDisabled && (
        <div className='flex justify-end'>
          <Button onClick={onSubmit} type='button' disabled={isPending}>
            {isPending ? '수정중' : '카테고리 수정하기'}
          </Button>
        </div>
      )}
    </div>
  )
}
