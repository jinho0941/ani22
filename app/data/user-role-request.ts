'use server'

import { db } from '@/lib/db'
import { RoleRequestWithUser, WithCursor } from '@/type'
import { UserRoleRequest } from '@prisma/client'
import { getCurrentUserId } from '@/app/data/user'

export const getUserRoleRequests = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<RoleRequestWithUser[]>> => {
  try {
    const requests = await db.userRoleRequest.findMany({
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

    if (!requests) throw new Error('존재하지 않는 요청입니다.')

    const lastRequest = requests[requests.length - 1]
    const cursorId = lastRequest ? lastRequest.id : null

    return { data: requests, cursorId }
  } catch (error) {
    throw new Error('유저 권한을 가져오는 중 에러가 발생하였습니다.')
  }
}

export const getCurrentUserRoleRequest =
  async (): Promise<UserRoleRequest | null> => {
    try {
      const userId = await getCurrentUserId()

      const userRoleRequest = await db.userRoleRequest.findUnique({
        where: {
          userId,
        },
      })
      if (!userRoleRequest) return null

      return userRoleRequest
    } catch (error) {
      throw new Error(
        '유저 권한 요청 데이터를 가져오는 중에 에러가 발생하였습니다.',
      )
    }
  }
