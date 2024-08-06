import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

import { useDebounce } from '@/app/hooks/use-debounce'

export const useEpisodeHeader = () => {
  const [option, setOption] = useState('new')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const updateSearchParams = (term: string) => {
      const query = new URLSearchParams(searchParams.toString())
      if (term) {
        query.set('search', term)
      } else {
        query.delete('search')
      }
      router.replace(`?${query}`)
    }

    updateSearchParams(debouncedSearchTerm)
  }, [debouncedSearchTerm, searchParams, router])

  const onSelected = (value: string) => {
    const query = new URLSearchParams({ order: value })
    router.replace(`?${query}`)
  }

  return { option, setOption, searchTerm, setSearchTerm, onSelected }
}
