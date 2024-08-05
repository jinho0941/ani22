'use server'

import { checkAdmin } from '@/lib/access'
import { db } from '@/lib/db'
import { EpisodeRequestWithUser, WithCursor } from '@/type'

export const getEpisodeRequestsWithUser = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<EpisodeRequestWithUser[]>> => {
  try {
    await checkAdmin()

    const requests = await db.episodeRequest.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
      take,
    })

    const lastRequest = requests[requests.length - 1]
    const cursorId = lastRequest.id ?? null

    return { data: requests, cursorId }
  } catch (error) {
    throw new Error('에피스드 요청 목록을 가져오는 중에 에러가 발생하였습니다.')
  }
}
