'use server'

import { ActionType } from '@/type'
import { Episode, UserRole } from '@prisma/client'
import { getCurrentUser, getCurrentUserId } from '@/app/data/user'
import { db } from '@/lib/db'

export const isCurrentUserUploaderOrAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    return user.role === UserRole.ADMIN || user.role === UserRole.UPLOADER
  } catch (error) {
    throw new Error('유저 권한을 확인하는 중에 에러가 발생하였습니다.')
  }
}

export const createEpisode = async (
  title: string,
): Promise<ActionType<Episode>> => {
  try {
    const userId = await getCurrentUserId()
    const isUploaderOrAdmin = await isCurrentUserUploaderOrAdmin()

    if (!isUploaderOrAdmin) {
      return { success: false, message: '권한이 없는 유저입니다.' }
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
export const editEpisodeTitle = async () => {}
export const editEpisodeThumbnail = async () => {}
export const editEpisodeAirDate = async () => {}
export const editEpisodeEndDate = async () => {}
export const editEpisodeDescription = async () => {}
export const editEpisodeTags = async () => {}

export const approveEpisodeRequest = async () => {}

export const rejectEpisodeRequest = async () => {}
