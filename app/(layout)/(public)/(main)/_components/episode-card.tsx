'use client'

import { FaHeart } from 'react-icons/fa'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/safe-image'
import { Button } from '@/components/ui/button'

type Props = {
  imgSrc: string
  title: string
  currentEpisode: number
  totalEpisodes: number
  href: string
}

export const EpisodeCard = ({
  imgSrc,
  title,
  currentEpisode,
  totalEpisodes,
  href,
}: Props) => {
  return (
    <Link href={href}>
      <div
        role='button'
        className='min-w-[220px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-900 rounded-md border border-neutral-900 dark:border-slate-400 group transition-all'
      >
        <div className='aspect-[4/5] relative border-b border-neutral-900 dark:border-slate-400'>
          <SafeImage
            src={imgSrc}
            alt={title}
            fill
            className='rounded-t-md brightness-90 group-hover:brightness-100 transition-all'
          />
          <Button size='icon' className='absolute top-0 right-0'>
            <FaHeart
              className={cn(
                'h-6 w-6 text-rose-500 hover:text-rose-500 dark:hover:text-rose-500',
              )}
            />
          </Button>
        </div>
        <div className='h-20 p-2'>
          <h2 className='truncate font-bold text-xl'>{title}</h2>
          <div className='mt-2 flex justify-between text-muted-foreground'>
            <span>
              {currentEpisode}/{totalEpisodes}화
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
