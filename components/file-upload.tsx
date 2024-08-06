'use client'

import { Edit2, Loader2 } from 'lucide-react'
import Image from 'next/image'
import '@uploadthing/react/styles.css'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'

interface FileUploadProps {
  onChange: (url?: string) => void
  value: string
  endpoint: 'imageUploader' | 'videoUploader'
  className?: string
  onIconClick?: () => void
  changeEvent?: () => void
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
  className,
  onIconClick,
  changeEvent,
}: FileUploadProps) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (value) {
      setIsLoading(true)
    }
  }, [value])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleReset = () => {
    onChange('')
    if (onIconClick) {
      onIconClick()
    }
  }

  const renderContent = () => {
    switch (endpoint) {
      case 'imageUploader':
        return (
          <Image
            fill
            src={value}
            alt='Upload'
            className={cn('object-cover rounded-md', className)}
            onLoadingComplete={handleLoad}
          />
        )
      case 'videoUploader':
        return (
          <video
            controls
            src={value}
            className={cn(
              'object-cover rounded-md',
              isLoading && 'hidden',
              className,
            )}
            onLoadedData={handleLoad}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        'relative h-full w-full aspect-[4/5] rounded-md',
        className,
      )}
    >
      {value ? (
        <>
          {isLoading && (
            <div className='flex items-center justify-center h-full w-full dark:bg-slate-900 bg-slate-300 rounded-md animate-pulse'>
              <Loader2 className='h-1/2 w-1/2 animate-spin' />
            </div>
          )}
          {renderContent()}
          <button
            onClick={handleReset}
            className='bg-black text-white p-2 rounded-full absolute top-2 right-2 shadow-sm group'
            type='button'
          >
            <Edit2 className='h-6 w-6 group-hover:text-rose-500 transition-all' />
          </button>
        </>
      ) : (
        <UploadDropzone
          className={cn(
            'aspect-[4/5] rounded-md border-black dark:border-white bg-slate-200 dark:bg-slate-800',
            className,
          )}
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
            setIsLoading(false)
            if (changeEvent) {
              changeEvent()
            }
          }}
          onUploadError={(error: Error) => {
            console.log(error)
          }}
        />
      )}
    </div>
  )
}
