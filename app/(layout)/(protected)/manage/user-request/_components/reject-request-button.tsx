'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { rejectUploaderRequest } from '@/app/action/user-role-request'
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
  requestId: string
}

export const RejectRequestButton = ({ requestId }: Props) => {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onOpen = () => {
    setIsOpen(true)
  }

  const onClose = () => {
    setIsOpen(false)
  }

  const onReject = () => {
    startTransition(async () => {
      const action = await rejectUploaderRequest({ requestId })

      if (!action.success) {
        toast.error(action.message)
        return
      }

      toast.success(action.message)
      onClose()
      router.refresh()
    })
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={onOpen} variant={'destructive'}>
          거절하기
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말로 요청을 거절 하겠습니까?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              요청을 거절하여도 추후에 유저가 다시 권한을 요청할수 있습니다.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction onClick={onReject} disabled={isPending}>
            거절하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
