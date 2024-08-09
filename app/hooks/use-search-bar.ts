import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { findEpisodeTitleByTitle } from '@/app/action/episode'
import { useDebounce } from './use-debounce'

const formSchema = z.object({
  search: z.string().min(1).max(50),
})

type FormSchema = z.infer<typeof formSchema>

export const useSearchBar = () => {
  const router = useRouter()
  const [results, setResults] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  })

  const searchValue = form.watch('search')
  const debouncedSearchValue = useDebounce(searchValue, 100)

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!debouncedSearchValue) {
        setResults([])
        return
      }

      try {
        const episodes = await findEpisodeTitleByTitle(debouncedSearchValue)
        setResults(episodes)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error searching episodes:', error)
      }
    }

    fetchEpisodes()
  }, [debouncedSearchValue])

  const onSubmit = (values: FormSchema) => {
    const { search } = values
    const query = new URLSearchParams({ find: search })
    form.reset()
    router.push(`/search?${query}`)
  }

  const onClick = (value: string) => {
    const query = new URLSearchParams({ find: value })
    form.reset()
    router.push(`/search?${query}`)
  }

  const clearResults = () => setResults([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) =>
        prevIndex < results.length - 1 ? prevIndex + 1 : 0,
      )
      return
    }

    if (e.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : results.length - 1,
      )
      return
    }

    if (
      e.key === 'Enter' &&
      selectedIndex >= 0 &&
      selectedIndex < results.length
    ) {
      onClick(results[selectedIndex])
      return
    }
  }

  return {
    form,
    results,
    onSubmit,
    onClick,
    clearResults,
    handleKeyDown,
    selectedIndex,
  }
}
