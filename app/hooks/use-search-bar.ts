import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const searchParam = useSearchParams()
  const find = searchParam.get('find')

  const [results, setResults] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const [searchValue, setSearchValue] = useState('')

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  })

  const inputValue = form.watch('search')

  useEffect(() => {
    clearResults()
  }, [find])

  const debounceValue = useDebounce(searchValue, 300)

  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!debounceValue) {
        clearResults()
        return
      }

      try {
        const episodes = await findEpisodeTitleByTitle(debounceValue)
        setResults(episodes)
        setSelectedIndex(-1)
      } catch (error) {
        console.error(error)
      }
    }

    fetchEpisodes()
  }, [debounceValue])

  const onSubmit = (values: FormSchema) => {
    if (selectedIndex !== -1) return
    const { search } = values
    const query = new URLSearchParams({ find: search })
    router.push(`/search?${query}`)
    if (results.includes(inputValue)) {
      form.setValue('search', results[selectedIndex])
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.handleSubmit(onSubmit)()
  }

  const onClick = (value: string) => {
    const query = new URLSearchParams({ find: value })
    router.push(`/search?${query}`)
    form.setValue('search', results[selectedIndex])
  }

  const clearResults = () => setResults([])

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (!results.length) return
      const nextIndex = (selectedIndex + 1) % results.length
      form.setValue('search', results[nextIndex])
      setSelectedIndex(nextIndex)
    } else if (e.key === 'ArrowUp') {
      if (!results.length) return
      const prevIndex = (selectedIndex - 1 + results.length) % results.length
      form.setValue('search', results[prevIndex])
      setSelectedIndex(prevIndex)
    } else if (
      e.key === 'Enter' &&
      selectedIndex >= 0 &&
      selectedIndex < results.length
    ) {
      onClick(results[selectedIndex])
    } else {
      setSearchValue(inputValue)
    }
  }

  return {
    form,
    results,
    handleFormSubmit,
    onClick,
    clearResults,
    handleKeyUp,
    selectedIndex,
  }
}
