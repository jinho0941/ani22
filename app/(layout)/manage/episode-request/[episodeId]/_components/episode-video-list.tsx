'use client'

import { SafeImage } from '@/components/safe-image'
import { VideoListHeader } from './video-list-header'
import { Video } from '@prisma/client'

type Props = {
  videos: Video[]
}

export const EpisodeVideoList = ({ videos }: Props) => {
  return (
    <div className='mt-20 p-4 rounded-md'>
      <VideoListHeader />
      <div className='mt-8 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4'>
        {videos.map((video) => (
          <div
            key={video.id}
            className='relative w-full aspect-video rounded-md'
          >
            <SafeImage
              src={video.thumbnailUrl ?? undefined}
              alt={video.title}
              fill
              className='object-cover rounded-md'
            />
            <span className='absolute top-4 right-4 font-bold text-xl text-white px-2 py-1 bg-black/70 rounded-md'>
              Ep.{video.order}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
