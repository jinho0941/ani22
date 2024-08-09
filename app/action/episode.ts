'use server'

import { ActionType } from '@/type'
import { Episode, RequestStatus } from '@prisma/client'
import { getCurrentUserId, isCurrentUserUploaderOrAdmin } from '@/app/data/user'
import { db } from '@/lib/db'
export type CreateEpisodeProps = {
  title: string
}

export const createEpisode = async ({
  title,
}: CreateEpisodeProps): Promise<ActionType<Episode>> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId)
      return {
        success: false,
        message: '현재 로그인이 되어있지 않습니다.',
      }

    const isUploader = await isCurrentUserUploaderOrAdmin()

    if (!isUploader)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

    const episode = await db.episode.create({
      data: {
        userId,
        title,
      },
    })
    if (!episode)
      return { success: false, message: '에피소드 생성에 실패하였습니다.' }

    return {
      success: true,
      message: '에피소드 생성에 성공하였습니다.',
      data: episode,
    }
  } catch (error) {
    return { success: false, message: '에피소드 생성에 실패하였습니다.' }
  }
}

export type UpdateEpisodeProps = {
  title?: string
  airDate?: Date
  endDate?: Date
  totalEpisodeCount?: number
  description?: string
  thumbnailUrl?: string
  categories?: string[]
  episodeId: string
}

export const updateEpisode = async ({
  title,
  airDate,
  endDate,
  totalEpisodeCount,
  description,
  thumbnailUrl,
  categories,
  episodeId,
}: UpdateEpisodeProps): Promise<ActionType<Episode>> => {
  try {
    if (
      !title &&
      !airDate &&
      !endDate &&
      !totalEpisodeCount &&
      !description &&
      !thumbnailUrl &&
      !categories?.length
    )
      return { success: false, message: '아무런 값을 입력하지 않았습니다.' }

    const episode = await db.episode.update({
      where: {
        id: episodeId,
      },
      data: {
        title,
        airDate,
        endDate,
        totalEpisodeCount,
        description,
        thumbnailUrl,
        categories,
      },
    })

    if (!episode) {
      return { success: false, message: '수정중에 에러가 발생하였습니다.' }
    }
    return {
      success: true,
      message: '에피소드 수정에 성공하였습니다.',
      data: episode,
    }
  } catch (error) {
    return { success: false, message: '수정중에 에러가 발생하였습니다.' }
  }
}

export const findEpisodeTitleByTitle = async (
  title: string,
): Promise<string[]> => {
  try {
    const episodes = await db.episode.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        episodeRequest: {
          status: RequestStatus.APPROVED,
        },
      },
      select: {
        title: true,
      },
      take: 10,
    })
    const titleList = episodes.map((episode) => episode.title)

    return titleList
  } catch (error) {
    console.error('Error finding episodes by title:', error)
    throw new Error('에피소드를 찾는 중에 에러가 발생하였습니다.')
  }
}
