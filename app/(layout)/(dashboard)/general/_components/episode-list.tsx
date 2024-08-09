'use client'

import { EpisodeWithIsFavorite } from '@/type'
import { useState, useTransition } from 'react'
import { EpisodeCard } from './episode-card'
import { getMyFavoriteEpisodes } from '@/app/data/episode'
import useInfiniteScroll from '@/app/hooks/use-infinite-scroll'
import { Skeleton } from '@/components/ui/skeleton'
import { take } from '@/constants'

type Props = {
  episodes: EpisodeWithIsFavorite[]
  cursorId: string | null
}

export const EpisodeList = ({ episodes, cursorId }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [initEpisodes, setInitEpisodes] = useState(episodes)
  const [initCursorId, setInitCursorId] = useState(cursorId)

  const skeletonCard = Array.from({ length: take }, (_, index) => (
    <div key={index}>
      <Skeleton className='aspect-[4/5] rounded-t-md' />
      <Skeleton className='h-20 rounded-b-md' />
    </div>
  ))

  const loadMoreEpisodes = async () => {
    startTransition(async () => {
      if (!initCursorId) return
      const result = await getMyFavoriteEpisodes(initCursorId, take)
      setInitEpisodes((prev) => [...prev, ...result.data])
      setInitCursorId(result.cursorId)
    })
  }

  const observer = useInfiniteScroll({
    callback: loadMoreEpisodes,
    cursorId: initCursorId,
    isLoading: isPending,
  })

  return (
    <div className='lg:text-2xl text-lg font-bold'>
      <span className='lg:text-xl text-sm font-medium'>pick</span>
      <span className='ml-1'>에피소드</span>
      <div className='mt-6 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6'>
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
      </div>
      <div ref={observer} />
    </div>
  )
}
