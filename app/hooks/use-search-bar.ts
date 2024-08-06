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

export const useSearchBar = () => {
  const router = useRouter()
  const [results, setResults] = useState<string[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  })

  const searchValue = form.watch('search')
  const debouncedSearchValue = useDebounce(searchValue, 100)

  const fetchEpisodes = async () => {
    if (debouncedSearchValue) {
      try {
        const episodes = await findEpisodeTitleByTitle(debouncedSearchValue)
        setResults(episodes)
      } catch (error) {
        console.error('Error searching episodes:', error)
      }
    } else {
      setResults([])
    }
  }

  useEffect(() => {
    fetchEpisodes()
  }, [debouncedSearchValue])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { search } = values
    const query = new URLSearchParams({ find: search })
    form.reset()
    router.push(`/search?${query}`)
  }

  return { form, results, onSubmit }
}
