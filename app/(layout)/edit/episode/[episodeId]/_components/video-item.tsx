'use client'

import { DraggableProvided } from '@hello-pangea/dnd'
import { Grip, Pencil } from 'lucide-react'
import Link from 'next/link'

import { SafeImage } from '@/components/safe-image'
import { RequestStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { VideoWithRequest } from '@/type'

type Props = {
  video: VideoWithRequest
  episodeId: string
  provided: DraggableProvided
}

const VideoItem = ({ video, episodeId, provided }: Props) => {
  const status = video.videoRequest?.status ?? null

  const renderRequestStatusBadge = (status: RequestStatus | null) => {
    switch (status) {
      case RequestStatus.PENDING:
        return (
          <Badge size={'sm'} className='bg-yellow-600 text-white'>
            신청중
          </Badge>
        )
      case RequestStatus.APPROVED:
        return (
          <Badge size={'sm'} className='bg-sky-500 text-white'>
            배포중
          </Badge>
        )
      case RequestStatus.REJECTED:
        return (
          <Badge size={'sm'} className='bg-red-500 text-white'>
            거절됨
          </Badge>
        )
      default:
        return (
          <Badge size={'sm'} className='bg-gray-300 text-gray-700'>
            미완성
          </Badge>
        )
    }
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className='flex gap-x-4'
    >
      <div className='relative shrink-0 aspect-video w-1/4 rounded-md'>
        <SafeImage
          src={video.thumbnailUrl ?? undefined}
          alt={video.title}
          fill
          className='rounded-md'
        />
      </div>
      <div className='flex flex-col overflow-x-hidden'>
        <p className='truncate'>
          <span className='font-bold'>{video.order}화:</span>
          <span className='ml-1'>{video.title}</span>
        </p>
        <div className='mt-1'>{renderRequestStatusBadge(status)}</div>
      </div>
      <div className='ml-auto flex items-center'>
        <Link href={`/edit/video/${video.id}`}>
          <div className='hover:bg-slate-300 dark:hover:bg-slate-700 p-3 rounded-md'>
            <Pencil />
          </div>
        </Link>
        <div
          {...provided.dragHandleProps}
          className='hover:bg-slate-300 dark:hover:bg-slate-700 p-2 rounded-md group'
        >
          <Grip className='h-8 w-8 group-active:text-rose-500 transition' />
        </div>
      </div>
    </div>
  )
}

export default VideoItem
