'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { approveUploaderRequest } from '@/app/action/user-role-request'
import { Button } from '@/components/ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Props = {
  requestUserId: string
  requestId: string
  username: string
  title: string
  content: string
}

export const ApproveRequestButton = ({
  requestUserId,
  requestId,
  username,
  title,
  content,
}: Props) => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onOpen = () => {
    setIsOpen(true)
  }

  const onClose = () => {
    setIsOpen(false)
  }

  const onApprove = () => {
    startTransition(async () => {
      const action = await approveUploaderRequest({ requestId, requestUserId })

      if (!action.success) {
        toast.error(action.message)
        return
      }

      toast.success(action.message)
      router.refresh()
      onClose()
    })
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={onOpen}>승인하기</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>요청자: {username}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <span className='font-bold'>제목: {title}</span>
              <p className='mt-2'>{content}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            취소하기
          </AlertDialogCancel>
          <AlertDialogAction onClick={onApprove} disabled={isPending}>
            승인하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
