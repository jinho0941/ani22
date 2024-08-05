'use server'

import { db } from '@/lib/db'
import { getCurrentUserId } from '@/app/data/user'
import { ActionType } from '@/type'
import { Video } from '@prisma/client'
import { cookies } from 'next/headers'
import { checkOwner } from '@/lib/access'

export const createVideo = async (
  title: string,
  episodeId: string,
): Promise<ActionType<Video>> => {
  try {
    const userId = await getCurrentUserId()

    await checkOwner(userId)

    const maxOrderVideo = await db.video.findFirst({
      where: { episodeId },
      orderBy: {
        order: 'desc',
      },
    })

    const newOrder = maxOrderVideo ? maxOrderVideo.order + 1 : 1

    const newVideo = await db.video.create({
      data: {
        title,
        episodeId,
        order: newOrder,
      },
    })

    return {
      success: true,
      message: '비디오를 성공적으로 생성하였습니다.',
      data: newVideo,
    }
  } catch (error) {
    console.error('Error creating video:', error)
    return {
      success: false,
      message: '비디오 생성 중에 에러가 발생하였습니다.',
    }
  }
}

export const updateVideoOrder = async (
  reorderedVideos: Video[],
): Promise<ActionType<Video>> => {
  try {
    const updatePromises = reorderedVideos.map((video) =>
      db.video.update({
        where: { id: video.id },
        data: { order: video.order },
      }),
    )

    await db.$transaction(updatePromises)

    return {
      success: true,
      message: '비디오 순서가 성공적으로 업데이트되었습니다.',
    }
  } catch (error) {
    console.error('Error updating video order:', error)
    return {
      success: false,
      message: '비디오 순서 업데이트 중에 에러가 발생하였습니다.',
    }
  }
}

export const updateVideo = async ({
  title,
  url,
  thumbnailUrl,
  description,
  videoId,
}: {
  title?: string
  url?: string
  thumbnailUrl?: string
  description?: string
  videoId: string
}): Promise<ActionType<Video>> => {
  try {
    if (!title && !url && !thumbnailUrl && !description)
      return { success: false, message: '아무런 값을 입력하지 않았습니다.' }

    const userId = await getCurrentUserId()

    await checkOwner(userId)

    const video = await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        title,
        url,
        description,
        thumbnailUrl,
      },
    })

    if (!video) {
      return { success: false, message: '수정중에 에러가 발생하였습니다.' }
    }

    return {
      success: true,
      message: '비디오 수정에 성공하였습니다.',
      data: video,
    }
  } catch (error) {
    return { success: false, message: '수정중에 에러가 발생하였습니다.' }
  }
}

export const increaseVideoCount = async (
  videoId: string,
): Promise<ActionType<null>> => {
  try {
    const cookieStore = cookies()
    const viewCookie = cookieStore.get(`viewed_${videoId}`)

    if (viewCookie) {
      console.log('User has already increased view count.')
      return { success: false, message: '이미 조회수를 올린 유저입니다.' }
    }

    const video = await db.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    })

    cookies().set(`viewed_${videoId}`, 'true', { maxAge: 30 * 60 })

    return { success: true, message: '조회수 증가' }
  } catch (error) {
    console.error('Error increasing view count:', error)
    return { success: false, message: '에러 발생' }
  }
}
