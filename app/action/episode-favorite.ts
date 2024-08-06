'use server'

import { ActionType } from '@/type'
import { EpisodeFavorite } from '@prisma/client'
import { getCurrentUserId } from '@/app/data/user'
import { db } from '@/lib/db'
import { checkOwner } from '@/lib/access'

export type ToggleProps = {
  episodeId: string
}

export const toggleEpisodeFavorite = async ({
  episodeId,
}: ToggleProps): Promise<ActionType<EpisodeFavorite>> => {
  try {
    const userId = await getCurrentUserId()

    await checkOwner(userId)

    const existingFavorite = await db.episodeFavorite.findUnique({
      where: {
        userId_episodeId: {
          userId,
          episodeId,
        },
      },
    })

    if (existingFavorite) {
      await db.episodeFavorite.delete({
        where: {
          userId_episodeId: {
            userId,
            episodeId,
          },
        },
      })

      return {
        success: true,
        message: '에피소드 즐겨찾기가 성공적으로 제거되었습니다.',
      }
    } else {
      await db.episodeFavorite.create({
        data: {
          userId,
          episodeId,
        },
      })

      return {
        success: true,
        message: '에피소드가 성공적으로 즐겨찾기에 추가되었습니다.',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: '에피소드 즐겨찾기 토글 중에 에러가 발생하였습니다.',
    }
  }
}
