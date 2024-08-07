import { Loader2, User } from 'lucide-react'
import Image from 'next/image'

type Props = {
  loading: boolean
  imageUrl?: string
}

export const RenderAvatar = ({ loading, imageUrl }: Props) => {
  if (loading)
    return (
      <div className='h-40 w-40 bg-slate-500 flex items-center justify-center rounded-full'>
        <Loader2 className='h-12 w-12 animate-spin' />
      </div>
    )
  if (imageUrl)
    return (
      <div className='relative h-40 w-40 rounded-full bg-slate-500'>
        <Image
          src={imageUrl}
          alt={'img'}
          fill
          sizes='(max-width: 768px) 100vw'
          className='rounded-full object-cover'
        />
      </div>
    )
  return (
    <div className='h-40 w-40 bg-slate-500 flex items-center justify-center rounded-full cursor-pointer'>
      <User className='h-12 w-12' />
    </div>
  )
}
