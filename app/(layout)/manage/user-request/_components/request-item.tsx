import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { RoleRequestWithUser } from '@/type'

import { ApproveRequestButton } from './approve-request-button'
import { RejectRequestButton } from './reject-request-button'

type Props = {
  request: RoleRequestWithUser
}

export const RequestItem = ({ request }: Props) => {
  return (
    <div className='grid grid-cols-3 px-4 py-2 border-b border-black dark:border-white'>
      <div className='flex gap-x-2 items-center overflow-x-hidden'>
        <Avatar>
          <AvatarImage src={request.user.imageUrl!} className='object-cover' />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <span className='truncate'>{request.user.nickname}</span>
      </div>
      <div className='flex items-center justify-center overflow-x-hidden'>
        <span className='font-bold truncate sm:block hidden'>
          {request.title}
        </span>
      </div>
      <div className='flex justify-end items-center gap-x-2'>
        <ApproveRequestButton
          requestUserId={request.user.id}
          username={request.user.nickname}
          requestId={request.id}
          title={request.title}
          content={request.content}
        />
        <RejectRequestButton requestId={request.id} />
      </div>
    </div>
  )
}
