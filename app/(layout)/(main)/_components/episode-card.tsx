'use client'

import { FaHeart } from 'react-icons/fa'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SafeImage } from '@/components/safe-image'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import { toggleEpisodeFavorite } from '@/app/action/episode-favorite'
import { toast } from 'sonner'

type Props = {
  episodeId: string
  imgSrc: string
  title: string
  totalEpisodes: number
  isFavorite: boolean
  href: string
}

export const EpisodeCard = ({
  episodeId,
  imgSrc,
  title,
  totalEpisodes,
  isFavorite,
  href,
}: Props) => {
  const [initIsFavorite, setInitIsFavorite] = useState(isFavorite)
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    startTransition(async () => {
      setInitIsFavorite((prev) => !prev)
      const action = await toggleEpisodeFavorite({ episodeId })
      if (!action.success) {
        toast.error(action.message)
        setInitIsFavorite((prev) => !prev)
        return
      }
    })
  }

  return (
    <div className='relative'>
      <Link href={href}>
        <div
          role='button'
          className='bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-900 rounded-md border border-neutral-900 dark:border-slate-400 group transition-all'
        >
          <div className='aspect-[4/5] relative border-b border-neutral-900 dark:border-slate-400'>
            <SafeImage
              src={imgSrc}
              alt={title}
              fill
              className='rounded-t-md brightness-90 group-hover:brightness-100 transition-all'
            />
          </div>
          <div className='h-20 p-2'>
            <h2 className='truncate font-bold text-xl'>{title}</h2>
            <div className='mt-2 flex justify-between text-muted-foreground'>
              <span>총 {totalEpisodes}화</span>
            </div>
          </div>
        </div>
      </Link>
      <Button
        disabled={isPending}
        onClick={onClick}
        size='icon'
        className='absolute top-0 right-0 bg-white/30'
      >
        <FaHeart className={cn('h-6 w-6', initIsFavorite && 'text-rose-500')} />
      </Button>
    </div>
  )
}
