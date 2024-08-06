import { getEpisodeById } from '@/app/data/episode'
import { getEpisodeRequestByEpisodeId } from '@/app/data/episode-request'
import { CreateEpisodeRequest } from './_components/create-episode-request'
import { getVideosByEpisodeId } from '@/app/data/video'
import { CreateVideo } from './_components/create-video'

const Page = async ({ params }: { params: { episodeId: string } }) => {
  const episodeId = params.episodeId
  const episode = await getEpisodeById(episodeId)
  const request = await getEpisodeRequestByEpisodeId(episodeId)
  const videos = await getVideosByEpisodeId(episodeId)

  return (
    <div className='w-[800px] grid grid-cols-2 gap-4'>
      <CreateEpisodeRequest
        episodeId={episodeId}
        episode={episode}
        request={request}
      />
      <CreateVideo episodeId={episodeId} videos={videos} />
    </div>
  )
}

export default Page
