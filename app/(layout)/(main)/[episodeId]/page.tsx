import { getEpisodeByIdWithVideos } from '@/app/data/episode'
import { NavContainer } from '@/components/nav-container'
import { format } from 'date-fns'
import { EpisodeInfo } from './_components/episode-info'
import { EpisodeVideoList } from './_components/episode-video-list'

const Page = async ({
  params,
  searchParams,
}: {
  params: { episodeId: string }
  searchParams: { order: 'new' | 'past' }
}) => {
  const episodeId = params.episodeId
  const order = searchParams.order ?? 'new'
  const episode = await getEpisodeByIdWithVideos(episodeId, order)

  return (
    <NavContainer>
      <div className='mt-4 max-w-screen-2xl mx-auto xl:px-0 px-4'>
        <EpisodeInfo
          title={episode.title}
          thumbnailUrl={episode.thumbnailUrl!}
          startDate={format(episode.airDate!, 'yyyy.MM.dd')}
          endDate={format(episode.endDate!, 'yyyy.MM.dd')}
          currentEpisodeCount={episode.videos.length}
          totalEpisodeCount={episode.totalEpisodeCount!}
          description={episode.description!}
          categories={episode.categories}
        />
        <EpisodeVideoList episodeId={episodeId} videos={episode.videos} />
      </div>
    </NavContainer>
  )
}

export default Page
