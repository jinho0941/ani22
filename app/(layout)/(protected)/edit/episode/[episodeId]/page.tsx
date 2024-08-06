import {
  getEpisodeCompletionStatus,
  getEpisodeWithRequestAndVideosById,
} from '@/app/data/episode'
import { NavContainer } from '@/components/nav-container'

import { EditEpisodeThumbnailImageForm } from './_components/edit-episode-thumbnail-image-form'
import { EditEpisodeTotalCountForm } from './_components/edit-episode-total-count-form'
import { EditEpisodeDescriptionForm } from './_components/edit-episode-description'
import { EditEpisodeCategoryForm } from './_components/edit-episode-category-form'
import { EditEpisodeAirDateForm } from './_components/edit-episode-air-date-form'
import { EditEpisodeEndDateForm } from './_components/edit-episode-end-date-form'
import { EditEpisodeTitleForm } from './_components/edit-episode-title-form'
import { CreateVideoButton } from './_components/create-video-button'
import { StatusBanner } from './_components/status-banner'
import { VideoList } from './_components/video-list'

const Page = async ({ params }: { params: { episodeId: string } }) => {
  const episodeId = params.episodeId

  const episode = await getEpisodeWithRequestAndVideosById(episodeId)
  const { count, isCompleted } = await getEpisodeCompletionStatus(episodeId)
  const requestStatus = episode.episodeRequest
    ? episode.episodeRequest.status
    : null
  const videos = episode.videos

  return (
    <NavContainer>
      <StatusBanner
        isCompleted={isCompleted}
        completeCount={count}
        episodeId={episodeId}
        requestStatus={requestStatus}
      />
      <section className='mt-10 max-w-screen-2xl mx-auto grid md:grid-cols-2 grid-cols-1 gap-x-8 lg:px-8 px-4 gap-y-4'>
        <div className='space-y-4'>
          <EditEpisodeTitleForm episode={episode} />
          <div className='sm:w-1/2'>
            <EditEpisodeThumbnailImageForm episode={episode} />
          </div>
          <EditEpisodeAirDateForm episode={episode} />
          <EditEpisodeEndDateForm episode={episode} />
        </div>
        <div className='space-y-4'>
          <EditEpisodeTotalCountForm episode={episode} />
          <EditEpisodeDescriptionForm episode={episode} />
          <EditEpisodeCategoryForm episode={episode} />
          <section className='bg-slate-200 dark:bg-slate-900 rounded-md p-4'>
            <div className='flex flex-col h-[500px] overflow-y-scroll scrollbar-hide'>
              <CreateVideoButton episodeId={episodeId} />
              <VideoList initialVideos={videos} episodeId={episodeId} />
            </div>
          </section>
        </div>
      </section>
    </NavContainer>
  )
}

export default Page
