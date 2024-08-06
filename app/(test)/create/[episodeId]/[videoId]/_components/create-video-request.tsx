import { updateVideo, UpdateVideoProps } from '@/app/action/video'
import {
  sendApprovalVideoRequest,
  SendApprovalVideoRequestProps,
} from '@/app/action/video-request'
import { ActionButton } from '@/components/action-button'
import { videoUrls } from '@/constants'
import { getRandomString } from '@/lib/utils'
import { faker } from '@faker-js/faker'
import { Video, VideoRequest } from '@prisma/client'

type Props = {
  request: VideoRequest
  videoId: string
  video: Video
}

export const CreateVideoRequest = ({ request, videoId, video }: Props) => {
  return (
    <div className='space-y-4'>
      <ActionButton<SendApprovalVideoRequestProps, VideoRequest>
        fn={sendApprovalVideoRequest}
        param={{ videoId }}
      >
        create video request
      </ActionButton>
      <div className='bg-slate-500 p-4 rounded-md space-y-2'>
        <div>status: {request ? request.status : '요청 없음'}</div>
        <ActionButton<UpdateVideoProps, Video>
          fn={updateVideo}
          param={{
            videoId,
            title: faker.word.words(),
            description: faker.word.words(8),
            thumbnailUrl: faker.image.url(),
            url: getRandomString(videoUrls),
          }}
        >
          모든 항목 채우기
        </ActionButton>
        <div>title: {video.title}</div>
        <div>description: {video.description}</div>
        <div>thumbnailUrl: {video.thumbnailUrl}</div>
        <div>url: {video.url}</div>
        <div>order: {video.order}</div>
      </div>
    </div>
  )
}
