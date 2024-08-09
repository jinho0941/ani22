import { getEpisodeByIdWithUserAndRequest } from '@/app/data/episode'
import { NavContainer } from '@/components/nav-container'
import { format } from 'date-fns'
import { RejectRequestButton } from './_components/reject-request-button'
import { ApproveRequestButton } from './_components/aprrove-request-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EpisodeInfo } from './_components/episode-info'
import { EpisodeVideoList } from './_components/episode-video-list'

const EpisodeRequestIdPage = async ({
  params,
}: {
  params: { episodeId: string }
}) => {
  const episodeId = params.episodeId
  const episode = await getEpisodeByIdWithUserAndRequest(episodeId)

  const videos = episode.videos

  const startDate = format(episode.airDate!, 'yyyy-MM-dd')
  const endDate = format(episode.endDate!, 'yyyy-MM-dd')

  const user = episode.user

  return (
    <NavContainer>
      <div className='max-w-screen-2xl mx-auto p-5 bg-slate-200 dark:bg-slate-900 rounded-md'>
        <div className='grid grid-cols-2 gap-x-4 py-4'>
          <RejectRequestButton requestId={episode.episodeRequest?.id!} />
          <ApproveRequestButton requestId={episode.episodeRequest?.id!} />
        </div>
        <div className='py-4'>
          <h2 className='text-xl font-bold'>신청자</h2>
          <div className='mt-2 flex items-center gap-x-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage src={user.imageUrl!} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className='text-xl font-bold'>{user.nickname}</div>
          </div>
        </div>
        <EpisodeInfo
          title={episode.title}
          startDate={startDate}
          thumbnailUrl={episode.thumbnailUrl!}
          endDate={endDate}
          currentEpisodeCount={episode.videos.length}
          totalEpisodeCount={episode.totalEpisodeCount!}
          description={episode.description!}
          categories={episode.categories}
        />
        <EpisodeVideoList videos={videos} />
      </div>
    </NavContainer>
  )
}

export default EpisodeRequestIdPage
