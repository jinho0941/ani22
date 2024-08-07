'use server'

import { checkAdmin } from '@/lib/access'
import { db } from '@/lib/db'
import { VideoRequestWithUserAndVideo, WithCursor } from '@/type'
import { VideoRequest } from '@prisma/client'

export const getVideoRequestByVideoId = async (
  videoId: string,
): Promise<VideoRequest> => {
  try {
    const request = await db.videoRequest.findUnique({
      where: {
        videoId,
      },
    })

    return request!
  } catch (error) {
    throw new Error('요청중에 에러가 발생하였습니다.')
  }
}

export const getVideoRequestsWithUserAndVideo = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<VideoRequestWithUserAndVideo[]>> => {
  try {
    await checkAdmin()

    const requests = await db.videoRequest.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        user: true,
        video: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
    })

    const lastRequest = requests[requests.length - 1]
    const cursorId = lastRequest ? lastRequest.id : null

    return { data: requests, cursorId }
  } catch (error) {
    throw new Error('요청중에 에러가 발생하였습니다.')
  }
}
