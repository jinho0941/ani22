'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/safe-image'

type Props = {
  videoId: string
  episodeId: string
  thumbnailUrl: string
  order: number
  title: string
}

export const VideoItem = ({
  videoId,
  episodeId,
  thumbnailUrl,
  order,
  title,
}: Props) => {
  const pathname = usePathname()
  const isCurrentPath = pathname === `/${episodeId}/${videoId}`

  return (
    <Link
      href={`/${episodeId}/${videoId}`}
      className={cn(
        'flex gap-x-4 lg:px-5 py-2 px-2 dark:hover:bg-slate-500 hover:bg-slate-300 transition-all cursor-pointer',
        isCurrentPath && 'dark:bg-slate-600 bg-slate-200',
      )}
    >
      <div className='flex-1 relative aspect-video'>
        <SafeImage
          src={thumbnailUrl}
          alt='poster'
          fill
          className='rounded-md'
        />
      </div>
      <div className='w-1/2 flex flex-col overflow-x-hidden'>
        <h3 className='lg:text-lg text-sm line-clamp-1'>
          {order}화: {title}
        </h3>
      </div>
    </Link>
  )
}
