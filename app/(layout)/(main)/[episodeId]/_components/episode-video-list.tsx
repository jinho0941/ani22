'use client'

import Link from 'next/link'

import { Video } from '@prisma/client'
import { SafeImage } from '@/components/safe-image'
import { VideoListHeader } from './video-list-header'

type Props = {
  episodeId: string
  videos: Video[]
}

export const EpisodeVideoList = ({ episodeId, videos }: Props) => {
  return (
    <div className='mt-20 py-4 rounded-md'>
      <VideoListHeader episodeId={episodeId} />
      <div className='mt-8 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4'>
        {videos.map((video) => (
          <Link
            href={`/${episodeId}/${video.id}`}
            className='brightness-90 hover:brightness-110 transition-all'
            key={video.id}
          >
            <div className='relative w-full aspect-video rounded-md'>
              <SafeImage
                src={video.thumbnailUrl!}
                alt={video.title}
                fill
                className='object-cover rounded-md'
              />
              <span className='absolute top-4 right-4 font-bold text-xl text-white px-2 py-1 bg-black/70 rounded-md'>
                Ep.{video.order}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
