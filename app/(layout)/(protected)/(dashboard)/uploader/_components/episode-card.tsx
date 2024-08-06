'use client'

import Link from 'next/link'

import { EpisodeRequest, RequestStatus } from '@prisma/client'
import { SafeImage } from '@/components/safe-image'
import { cn } from '@/lib/utils'

type Props = {
  imgSrc: string
  title: string
  request: EpisodeRequest | null
  href: string
}

export const EpisodeCard = ({ imgSrc, request, title, href }: Props) => {
  return (
    <Link href={href} className='relative text-white'>
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
      </div>
      <div
        className={cn(
          'absolute top-0 bg-black/50 w-full p-1 rounded-t-md',
          request?.status === RequestStatus.APPROVED && 'bg-sky-500',
          request?.status === RequestStatus.PENDING && 'bg-yellow-500',
          request?.status === RequestStatus.REJECTED && 'bg-rose-500',
          !request && 'bg-indigo-500',
        )}
      >
        {request ? request.status : '배포 신청을 해주세요.'}
      </div>
      <div className='absolute bottom-0 bg-black/50 w-full p-1 rounded-b-md'>
        <h3 className='truncate'>{title}</h3>
      </div>
    </Link>
  )
}
