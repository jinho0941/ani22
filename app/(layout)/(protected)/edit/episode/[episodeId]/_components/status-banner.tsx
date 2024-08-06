'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { RequestStatus } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import {
  deleteEpisodeRequest,
  sendEpisodeApprovalRequest,
} from '@/app/action/episode-request'
import { useRouter } from 'next/navigation'

type Props = {
  isCompleted: boolean
  completeCount: number
  episodeId: string
  requestStatus: RequestStatus | null
}

export const StatusBanner = ({
  isCompleted,
  completeCount,
  episodeId,
  requestStatus,
}: Props) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRequestPublish = () => {
    startTransition(async () => {
      const action = await sendEpisodeApprovalRequest({ episodeId })
      if (action.success) {
        toast.success(action.message)
        router.refresh()
      } else {
        toast.error(action.message)
      }
    })
  }

  const handleReRequestPublish = () => {
    startTransition(async () => {
      const action = await sendEpisodeApprovalRequest({ episodeId })
      if (action.success) {
        toast.success(action.message)
        router.refresh()
      } else {
        toast.error(action.message)
      }
    })
  }

  const handleCancelRequest = () => {
    startTransition(async () => {
      const action = await deleteEpisodeRequest({ episodeId })
      if (action.success) {
        toast.success(action.message)
        router.refresh()
      } else {
        toast.error(action.message)
      }
    })
  }

  const renderRequestStatusBadge = (status: RequestStatus | null) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Badge size={'lg'}>신청중</Badge>
      case RequestStatus.APPROVED:
        return (
          <Badge size={'lg'} className='bg-green-500 text-white'>
            승인됨
          </Badge>
        )
      case RequestStatus.REJECTED:
        return (
          <Badge size={'lg'} className='bg-red-500 text-white'>
            거절됨
          </Badge>
        )
      default:
        return isCompleted ? (
          <Badge size={'lg'} className='bg-gray-500 text-white'>
            작성 완료
          </Badge>
        ) : (
          <Badge size={'lg'} className='bg-gray-300 text-gray-700'>
            미완성
          </Badge>
        )
    }
  }

  const getBackgroundClass = () => {
    switch (requestStatus) {
      case RequestStatus.APPROVED:
        return 'dark:bg-sky-800 bg-sky-500'
      case RequestStatus.REJECTED:
        return 'dark:bg-red-800 bg-red-500'
      case RequestStatus.PENDING:
        return 'dark:bg-yellow-800 bg-yellow-500'
      default:
        return isCompleted
          ? 'dark:bg-green-800 bg-green-500'
          : 'bg-yellow-500 dark:bg-yellow-900'
    }
  }

  const getStatusMessage = () => {
    switch (requestStatus) {
      case RequestStatus.APPROVED:
        return '에피소드가 배포되었습니다.'
      case RequestStatus.REJECTED:
        return '배포 신청이 거절되었습니다. 필요한 항목을 수정하고 다시 신청하십시오.'
      case RequestStatus.PENDING:
        return '배포 신청이 처리 중입니다.'
      default:
        return isCompleted
          ? '모든 항목 작성을 완료하였습니다. 에피소드 배포 신청을 하십시오.'
          : '아직 완료하지 않은 항목이 있습니다. 모든 항목을 채워주십시오.'
    }
  }

  return (
    <div className={cn('px-4 py-2', getBackgroundClass())}>
      <div className='flex items-center gap-x-2'>
        <span>상태:</span>
        {renderRequestStatusBadge(requestStatus)}
      </div>
      <div className='flex items-center gap-x-2 mt-2'>
        <div className='font-semibold'>
          <span className='mr-2 font-bold md:text-xl text-lg'>
            {completeCount} / 7
          </span>
          {getStatusMessage()}
        </div>
        {requestStatus ? (
          <>
            {requestStatus === RequestStatus.PENDING && (
              <Button
                className='ml-2'
                variant={'destructive'}
                onClick={handleCancelRequest}
                disabled={isPending}
              >
                {isPending ? '취소 중...' : '신청 취소'}
              </Button>
            )}
            {requestStatus === RequestStatus.REJECTED && (
              <Button
                className='ml-2'
                onClick={handleReRequestPublish}
                disabled={isPending}
              >
                {isPending ? '재신청 중...' : '재신청하기'}
              </Button>
            )}
          </>
        ) : (
          isCompleted && (
            <Button
              className='ml-2'
              onClick={handleRequestPublish}
              disabled={isPending}
            >
              {isPending ? '신청 중...' : '신청하기'}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
