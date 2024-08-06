'use client'

import { cn } from '@/lib/utils'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  src?: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
}

export const SafeImage = ({
  src,
  fill,
  width,
  height,
  alt,
  className,
}: Props) => {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div
        className={cn(
          'h-full w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-col text-center gap-y-4 rounded-t-md',
          className,
        )}
      >
        <ImageOff className='w-1/4 h-1/4' />
        <p className='text-sm sm:block hidden'>
          이미지가 존재하지 않습니다. 😱
        </p>
      </div>
    )
  }
  return (
    <Image
      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      src={src ?? '/no-image.jpg'}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={cn('object-cover', className)}
      placeholder='blur'
      blurDataURL='/no-image.jpg'
      onError={() => setImageError(true)}
    />
  )
}
