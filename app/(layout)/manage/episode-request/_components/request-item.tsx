import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EpisodeRequestWithUser } from '@/type'

import { format } from 'date-fns'
import Link from 'next/link'

type Props = {
  request: EpisodeRequestWithUser
}

export const RequestItem = ({ request }: Props) => {
  const formattedDate = format(request.createdAt, 'yyyy-MM-dd')

  return (
    <Link href={`/manage/episode-request/${request.episode.id}`}>
      <div className='flex p-4 justify-between items-center bg-slate-300 dark:bg-slate-700 rounded-md cursor-pointer hover:bg-slate-400 dark:hover:bg-slate-800 transition-all'>
        <div className='flex gap-x-2 items-center overflow-hidden truncate'>
          <Avatar>
            <AvatarImage
              src={request.user.imageUrl!}
              className='object-cover'
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className='font-bold text-lg'>{request.user.nickname}</span>
        </div>
        <div className='truncate sm:block hidden'>
          제목: {request.episode.title}
        </div>
        <div className='truncate flex items-center overflow-hidden'>
          <span className='mr-1 sm:block hidden'>요청일:</span>
          {formattedDate}
        </div>
      </div>
    </Link>
  )
}
