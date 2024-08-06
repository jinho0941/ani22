'use client'
import { useEffect, useRef, useCallback } from 'react'

interface Props {
  callback: () => Promise<void>
  isLoading: boolean
  cursorId: string | null
}

const useInfiniteScroll = ({ callback, isLoading, cursorId }: Props) => {
  const obsRef = useRef(null)

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !isLoading && cursorId) {
        callback()
      }
    },
    [callback, cursorId, isLoading],
  )

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(handleIntersect, {
      threshold: 1,
    })

    if (obsRef.current) intersectionObserver.observe(obsRef.current)

    return () => {
      intersectionObserver.disconnect()
    }
  }, [handleIntersect])

  return obsRef
}

export default useInfiniteScroll
