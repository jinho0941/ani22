import { Video } from '@prisma/client'

import { VideoItem } from './video-item'

type Props = {
  episodeId: string
  videoList: Video[]
}

export const VideoList = ({ episodeId, videoList }: Props) => {
  return (
    <div className='mt-5 relative flex-1 lg:h-0 lg:min-h-0 min-h-[350px]'>
      <div className='absolute inset-0 overflow-y-auto scrollbar-hide'>
        {videoList.map((video) => (
          <VideoItem
            key={video.id}
            episodeId={episodeId}
            videoId={video.id}
            title={video.title}
            thumbnailUrl={video.thumbnailUrl!}
            order={video.order}
          />
        ))}
      </div>
    </div>
  )
}
