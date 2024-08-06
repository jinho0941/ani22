import {
  getVideoCompletionStatus,
  getVideoWithRequestById,
} from '@/app/data/video'

import { EditVideoThumbnailImageForm } from './_component/edit-video-thumbnail-image-form'
import { EditVideoDescriptionForm } from './_component/edit-video-description'
import { EditVideoTitleForm } from './_component/edit-video-title-form'
import { EditVideoUrlForm } from './_component/edit-video-url-form'
import { NavContainer } from '@/components/nav-container'
import { StatusBanner } from './_component/status-banner'

const VideoIdPage = async ({ params }: { params: { videoId: string } }) => {
  const videoId = params.videoId
  const video = await getVideoWithRequestById(videoId)
  const { count, isCompleted } = await getVideoCompletionStatus(videoId)
  const requestStatus = video.videoRequest ? video.videoRequest.status : null

  return (
    <NavContainer>
      <StatusBanner
        isCompleted={isCompleted}
        completeCount={count}
        videoId={videoId}
        requestStatus={requestStatus}
      />
      <section className='mt-10 max-w-screen-2xl mx-auto grid md:grid-cols-2 grid-cols-1 gap-x-8 lg:px-8 px-4 gap-y-4'>
        <div className='lg:space-y-8 space-y-4'>
          <EditVideoTitleForm video={video} />
          <EditVideoThumbnailImageForm video={video} />
        </div>
        <div className='lg:space-y-8 space-y-4'>
          <EditVideoDescriptionForm video={video} />
          <EditVideoUrlForm video={video} />
        </div>
      </section>
    </NavContainer>
  )
}

export default VideoIdPage
