import { useEffect, useState, useTransition } from 'react'

import { getMyUploadedEpisodes } from '@/app/data/episode'
import { EpisodeWithRequest } from '@/type'
import { take } from '@/constants'

export const useEpisodeList = (
  initialEpisodes: EpisodeWithRequest[],
  initialCursorId: string | null,
  search: string,
  order: 'new' | 'past',
) => {
  const [isPending, startTransition] = useTransition()
  const [episodes, setEpisodes] = useState(initialEpisodes)
  const [cursorId, setCursorId] = useState(initialCursorId)

  useEffect(() => {
    setEpisodes(initialEpisodes)
    setCursorId(initialCursorId)
  }, [search, order, initialEpisodes, initialCursorId])

  const loadMoreEpisodes = async () => {
    startTransition(async () => {
      if (!cursorId) return
      const result = await getMyUploadedEpisodes(cursorId, take, order, search)
      setEpisodes((prev) => [...prev, ...result.data])
      setCursorId(result.cursorId)
    })
  }

  return { episodes, isPending, loadMoreEpisodes, cursorId }
}
