'use client'
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
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { rejectEpisodeRequest } from '@/app/action/episode-request'
import { useRouter } from 'next/navigation'

type Props = {
  requestId: string
}

export const RejectRequestButton = ({ requestId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const router = useRouter()

  const onOpen = () => {
    setIsOpen(true)
  }

  const onClose = () => {
    setIsOpen(false)
  }

  const onApprove = () => {
    startTransition(async () => {
      const action = await rejectEpisodeRequest({ requestId })

      if (!action.success) {
        toast.error(action.message)
        return
      }

      toast.success(action.message)
      router.replace('/manage/episode-request')
      onClose()
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
          <AlertDialogTitle>요청을 거절 하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            요청을 거절하면 에피소드가 취소됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            취소하기
          </AlertDialogCancel>
          <AlertDialogAction onClick={onApprove} disabled={isPending}>
            거절하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
