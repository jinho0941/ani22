import { SafeImage } from '@/components/safe-image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

import { getVideoByIdWithUserAndRequest } from '@/app/data/video'
import { NavContainer } from '@/components/nav-container'
import { ApproveVideoRequestButton } from './_components/approve-video-request-button'
import { RejectVideoRequestButton } from './_components/reject-request-button'

const VideoRequestIdPage = async ({
  params,
}: {
  params: { videoId: string }
}) => {
  const videoId = params.videoId
  const video = await getVideoByIdWithUserAndRequest(videoId)

  const requestDate = format(video.videoRequest?.createdAt!, 'yyyy-MM-dd')

  return (
    <NavContainer>
      <div className='max-w-4xl mx-auto py-8 px-4'>
        <div className='flex items-center justify-between bg-gray-100 dark:bg-slate-700 p-4 rounded-lg mb-8'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-12 w-12'>
              <AvatarImage src={video.user.imageUrl!} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className='font-semibold text-lg'>{video.user.nickname}</span>
          </div>
          <div className='flex space-x-2'>
            <ApproveVideoRequestButton requestId={video.videoRequest?.id!} />
            <RejectVideoRequestButton requestId={video.videoRequest?.id!} />
          </div>
        </div>

        <section className='space-y-8'>
          <div className='bg-white dark:bg-slate-700 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>썸네일</h2>
            <div className='relative aspect-video w-full max-w-2xl mx-auto'>
              <SafeImage
                src={video.thumbnailUrl ?? ''}
                alt={video.title}
                fill
                className='rounded-md'
              />
            </div>
          </div>

          <div className='bg-white dark:bg-slate-700 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>비디오</h2>
            <video
              className='aspect-video w-full max-w-2xl mx-auto'
              src={video.url!}
              controls
            />
          </div>

          <div className='bg-white dark:bg-slate-700 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-2'>제목</h2>
            <p>{video.title}</p>
          </div>

          <div className='bg-white dark:bg-slate-700 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-2'>설명</h2>
            <p className='whitespace-pre-wrap'>{video.description}</p>
          </div>

          <div className='bg-white dark:bg-slate-700 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-2'>요청일</h2>
            <p>{requestDate}</p>
          </div>
        </section>
      </div>
    </NavContainer>
  )
}

export default VideoRequestIdPage
