'use client'

import { useEffect, useState, useTransition } from 'react'

import useInfiniteScroll from '@/app/hooks/use-infinite-scroll'
import { Skeleton } from '@/components/ui/skeleton'
import { VideoRequestWithUserAndVideo } from '@/type'

import { RequestItem } from './request-item'
import { getVideoRequestsWithUserAndVideo } from '@/app/data/video-request'
import { take } from '@/constants'

type Props = {
  requests: VideoRequestWithUserAndVideo[]
  cursorId: string | null
}
export const RequestList = ({ requests, cursorId }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [initRequests, setInitRequests] = useState(requests)
  const [initCursorId, setInitCursorId] = useState(cursorId)

  const skeletonCard = Array.from({ length: take }, (_, index) => (
    <div key={index}>
      <Skeleton className='h-14 w-full rounded-t-md my-2' />
    </div>
  ))

  useEffect(() => {
    setInitRequests(requests)
    setInitCursorId(cursorId)
  }, [requests, cursorId])

  const loadMore = async () => {
    startTransition(async () => {
      if (!initCursorId) return
      const result = await getVideoRequestsWithUserAndVideo(initCursorId, take)
      setInitRequests((prev) => [...prev, ...result.data])
      setInitCursorId(result.cursorId)
    })
  }

  const observer = useInfiniteScroll({
    callback: loadMore,
    cursorId: initCursorId,
    isLoading: isPending,
  })

  return (
    <>
      {initRequests.map((request) => (
        <RequestItem key={request.id} request={request} />
      ))}
      {isPending && skeletonCard}
      <div ref={observer} />
    </>
  )
}
