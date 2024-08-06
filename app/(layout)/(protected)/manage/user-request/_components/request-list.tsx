'use client'

import { useEffect, useState, useTransition } from 'react'

import { getUserRoleRequests } from '@/app/data/user-role-request'
import useInfiniteScroll from '@/app/hooks/use-infinite-scroll'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleRequestWithUser } from '@/type'

import { RequestItem } from './request-item'

type Props = {
  requests: RoleRequestWithUser[]
  cursorId: string | null
}
export const RequestList = ({ requests, cursorId }: Props) => {
  const [isPending, startTransition] = useTransition()
  const [initRequests, setInitRequests] = useState(requests)
  const [initCursorId, setInitCursorId] = useState(cursorId)

  const skeletonCard = Array.from({ length: 5 }, (_, index) => (
    <div key={index}>
      <Skeleton className='h-14 w-full rounded-t-md my-2' />
    </div>
  ))

  useEffect(() => {
    setInitRequests(requests)
    setInitCursorId(cursorId)
  }, [requests, cursorId])

  const loadMoreEpisodes = async () => {
    startTransition(async () => {
      if (!initCursorId) return
      const result = await getUserRoleRequests(initCursorId, 2)
      setInitRequests((prev) => [...prev, ...result.data])
      setInitCursorId(result.cursorId)
    })
  }

  const observer = useInfiniteScroll({
    callback: loadMoreEpisodes,
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
