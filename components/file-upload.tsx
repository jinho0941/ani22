'use client'

import { Edit2, Loader2, Upload } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'
import { useTheme } from 'next-themes'

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
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { theme } = useTheme()

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

  const renderUploadProgress = () => (
    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md'>
      <div className='text-white text-center'>
        <Loader2 className='h-10 w-10 animate-spin mx-auto mb-2' />
        <p className='text-sm'>업로드 중... {uploadProgress}%</p>
      </div>
    </div>
  )

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
            <div className='flex items-center justify-center h-full w-full bg-slate-300 dark:bg-slate-900 rounded-md animate-pulse'>
              <Loader2 className='h-1/2 w-1/2 animate-spin' />
            </div>
          )}
          {renderContent()}
          <button
            onClick={handleReset}
            className='bg-black text-white p-2 rounded-full absolute top-2 right-2 shadow-sm hover:text-rose-500 transition-all'
            type='button'
          >
            <Edit2 className='h-6 w-6' />
          </button>
        </>
      ) : (
        <>
          <UploadDropzone
            className={cn(
              'flex h-full items-center justify-center p-4 rounded-md border-2 border-dashed',
              'border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800',
              isUploading && 'opacity-50',
              className,
            )}
            endpoint={endpoint}
            onUploadBegin={() => {
              setIsUploading(true)
              setUploadProgress(0)
            }}
            onUploadProgress={(progress) => {
              setUploadProgress(Math.round(progress))
            }}
            onClientUploadComplete={(res) => {
              onChange(res?.[0].url)
              setIsLoading(false)
              setIsUploading(false)
              if (changeEvent) {
                changeEvent()
              }
            }}
            onUploadError={(error: Error) => {
              console.error(error)
              setIsUploading(false)
            }}
            config={{
              mode: 'auto',
            }}
            content={{
              label: '파일을 업로드하세요',
              allowedContent:
                endpoint === 'imageUploader'
                  ? '이미지 파일만 업로드 가능합니다'
                  : '비디오 파일만 업로드 가능합니다',
              button: (
                <button
                  className='px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer'
                  type='button'
                >
                  파일 선택
                </button>
              ),
            }}
          />
          {isUploading && renderUploadProgress()}
        </>
      )}
    </div>
  )
}
