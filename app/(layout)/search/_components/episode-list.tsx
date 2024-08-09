'use client'

import { EpisodeWithIsFavorite } from '@/type'
import { useEffect, useState, useTransition } from 'react'
import { EpisodeCard } from './episode-card'
import { getEpisodesWithIsFavorite } from '@/app/data/episode'
import useInfiniteScroll from '@/app/hooks/use-infinite-scroll'
import { Skeleton } from '@/components/ui/skeleton'
import { NoResults } from './no-result'

type Props = {
  episodes: EpisodeWithIsFavorite[]
  cursorId: string | null
  search: string
}

export const EpisodeList = ({ episodes, cursorId, search }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [initEpisodes, setInitEpisodes] = useState(episodes)
  const [initCursorId, setInitCursorId] = useState(cursorId)

  const skeletonCard = Array.from({ length: 5 }, (_, index) => (
    <div key={index}>
      <Skeleton className='aspect-[4/5] rounded-t-md' />
      <Skeleton className='h-20 rounded-b-md' />
    </div>
  ))

  useEffect(() => {
    setInitEpisodes(episodes)
    setInitCursorId(cursorId)
  }, [search, episodes, cursorId])

  const loadMoreEpisodes = async () => {
    startTransition(async () => {
      if (!initCursorId) return
      const result = await getEpisodesWithIsFavorite(initCursorId, 2, search)
      setInitEpisodes((prev) => [...prev, ...result.data])
      setInitCursorId(result.cursorId)
    })
  }

  const observer = useInfiniteScroll({
    callback: loadMoreEpisodes,
    cursorId: initCursorId,
    isLoading: isPending,
  })
  if (initEpisodes.length === 0 && !isPending) {
    return <NoResults searchTerm={search} />
  }

  return (
    <>
      {initEpisodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          episodeId={episode.id}
          imgSrc={episode.thumbnailUrl!}
          title={episode.title}
          totalEpisodes={episode.totalEpisodeCount!}
          href={`/${episode.id}`}
          isFavorite={episode.isFavorite}
        />
      ))}
      {isPending && skeletonCard}
      <div ref={observer} />
    </>
  )
}
