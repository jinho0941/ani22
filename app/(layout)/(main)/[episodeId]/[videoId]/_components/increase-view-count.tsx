'use client'

import { increaseVideoCount } from '@/app/action/video'
import { useEffect } from 'react'

type Props = {
  videoId: string
}
export const IncreaseViewCount = ({ videoId }: Props) => {
  useEffect(() => {
    const action = async () => {
      await increaseVideoCount({ videoId })
    }
    action()
  }, [videoId])
  return null
}
