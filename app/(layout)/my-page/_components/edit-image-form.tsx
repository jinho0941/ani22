'use client'

import { Edit2 } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { RenderAvatar } from './render-avatar'
import { editUserImg } from '@/app/action/user'
import UploadButton from '@/components/upload-button'

type Props = {
  userImg?: string
}

export default function EditImageForm({ userImg }: Props) {
  const [imageUrl, setImageUrl] = useState(userImg)
  const [loading, setLoading] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setShowButtons(imageUrl !== userImg)
  }, [imageUrl, userImg])

  const onChange = (url?: string) => {
    if (!url) return
    setImageUrl(url)
    setLoading(false)
  }

  const onUploadBegin = () => {
    setLoading(true)
  }

  const onCancel = () => {
    setImageUrl(userImg)
    setLoading(false)
  }

  const onEdit = () => {
    if (!imageUrl) {
      toast.error('이미지를 선택해 주세요.')
      return
    }
    startTransition(async () => {
      const action = await editUserImg({ imageUrl })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.refresh()
    })
  }

  const customButton = () => {
    return (
      <div className='z-10 bg-indigo-500 rounded-full p-2 border border-black cursor-pointer hover:bg-indigo-600 transition-colors'>
        <Edit2 className='h-4 w-4 text-white' />
      </div>
    )
  }

  return (
    <div className='relative'>
      <RenderAvatar loading={loading} imageUrl={imageUrl} />
      <div className='absolute top-0 right-0 flex space-x-2'>
        <UploadButton
          onChange={onChange}
          onUploadBegin={onUploadBegin}
          CustomButton={customButton}
        />
      </div>
      {showButtons && (
        <div className='mt-4 flex gap-x-2 justify-center'>
          <Button
            disabled={isPending || loading}
            className='bg-rose-500 hover:bg-rose-600 text-white'
            onClick={onCancel}
          >
            취소하기
          </Button>
          <Button
            disabled={isPending || loading || imageUrl === userImg}
            className='bg-green-500 hover:bg-green-600 text-white'
            onClick={onEdit}
          >
            바꾸기
          </Button>
        </div>
      )}
    </div>
  )
}
