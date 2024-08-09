import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
  username: string
  userImg: string
  date: string
  content: string
}

export const Comment = async ({ username, userImg, date, content }: Props) => {
  return (
    <div className='mt-6'>
      <div className='flex gap-x-4'>
        <Avatar>
          <AvatarImage src={userImg} alt={'img'} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className='flex flex-col break-all items-start'>
          <div className='space-x-2'>
            <span className='text-lg font-bold'>{username}</span>
            <span className='text-muted-foreground text-sm'>{date}</span>
          </div>
          <p className='mt-1 whitespace-pre'>{content}</p>
        </div>
      </div>
    </div>
  )
}
