'use server'

import { checkAdmin } from '@/lib/access'
import { db } from '@/lib/db'
import { VideoRequestWithUser, WithCursor } from '@/type'
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

    if (!request) throw new Error('존재하지 않는 요청입니다.')

    return request
  } catch (error) {
    throw new Error('요청중에 에러가 발생하였습니다.')
  }
}

export const getVideoRequestsWithUser = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<VideoRequestWithUser[]>> => {
  try {
    await checkAdmin()

    const requests = await db.videoRequest.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take,
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
    })

    const lastRequest = requests[requests.length - 1]
    const cursorId = lastRequest.id ?? null

    return { data: requests, cursorId }
  } catch (error) {
    throw new Error('요청중에 에러가 발생하였습니다.')
  }
}
