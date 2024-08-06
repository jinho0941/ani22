'use client'

import useInfiniteScroll from '@/app/hooks/use-infinite-scroll'
import { useEpisodeList } from '@/app/hooks/use-episode-list'
import { Skeleton } from '@/components/ui/skeleton'
import { EpisodeWithRequest } from '@/type'

import { EpisodeCard } from './episode-card'

type Props = {
  episodes: EpisodeWithRequest[]
  cursorId: string | null
  search: string
  order: 'new' | 'past'
}

export const EpisodeList = ({ episodes, cursorId, search, order }: Props) => {
  const {
    episodes: initEpisodes,
    isPending,
    loadMoreEpisodes,
    cursorId: initCursorId,
  } = useEpisodeList(episodes, cursorId, search, order)

  const skeletonCard = Array.from({ length: 5 }, (_, index) => (
    <div key={index}>
      <Skeleton className='aspect-[4/5] rounded-t-md' />
    </div>
  ))

  const observer = useInfiniteScroll({
    callback: loadMoreEpisodes,
    cursorId: initCursorId,
    isLoading: isPending,
  })

  return (
    <>
      {initEpisodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          imgSrc={episode.thumbnailUrl!}
          title={episode.title}
          href={`/${episode.id}`}
          request={episode.episodeRequest}
        />
      ))}
      {isPending && skeletonCard}
      <div ref={observer} />
    </>
  )
}
