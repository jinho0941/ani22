'use server'

import { db } from '@/lib/db'
import {
  VideoWithEpisodesAndComments,
  VideoWithRequest,
  VideoWithUser,
  VideoWithUserAndRequest,
} from '@/type'
import { Video } from '@prisma/client'

export const getVideoByIdWithEpisodesAndComments = async (
  videoId: string,
): Promise<VideoWithEpisodesAndComments> => {
  try {
    const video = await db.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        episode: {
          include: {
            videos: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: true,
          },
        },
      },
    })
    if (!video) throw new Error('존재하지 않는 비디오 입니다.')

    return video
  } catch (error) {
    throw new Error('비디오 요청중에 에러가 발생하였습니다.')
  }
}

export const getVideoWithRequestById = async (
  videoId: string,
): Promise<VideoWithRequest> => {
  try {
    const video = await db.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        videoRequest: true,
      },
    })
    if (!video) throw new Error('존재하지 않는 비디오 입니다.')

    return video
  } catch (error) {
    throw new Error('비디오 요청중에 에러가 발생하였습니다.')
  }
}

export const getVideoByIdWithUser = async (
  videoId: string,
): Promise<VideoWithUser> => {
  try {
    const video = await db.video.findUnique({
      where: { id: videoId },
      include: { user: true },
    })
    if (!video) throw new Error('존재하지 않는 비디오 입니다.')

    return video
  } catch (error) {
    throw new Error('비디오 요청중에 에러가 발생하였습니다.')
  }
}

export const getVideoCompletionStatus = async (
  videoId: string,
): Promise<{ count: number; isCompleted: boolean }> => {
  try {
    const video = await db.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        url: true,
        thumbnailUrl: true,
        description: true,
      },
    })

    if (!video) throw new Error('현재 비디오가 존재하지 않습니다.')

    type VideoFields = {
      title: string
      url: string | null
      thumbnailUrl: string | null
      description: string | null
    }

    const videoFieldsToCheck: (keyof VideoFields)[] = [
      'title',
      'url',
      'thumbnailUrl',
      'description',
    ]

    const filledFieldsCount = videoFieldsToCheck.reduce((count, field) => {
      const value = video[field as keyof VideoFields]
      return value !== null && value !== undefined ? count + 1 : count
    }, 0)

    return {
      count: filledFieldsCount,
      isCompleted: videoFieldsToCheck.length === filledFieldsCount,
    }
  } catch (error) {
    throw new Error(
      '비디오 데이터의 완성 상태를 확인하는 중에 에러가 발생하였습니다.',
    )
  }
}

export const getVideosByEpisodeId = async (
  episodeId: string,
): Promise<Video[]> => {
  try {
    const videos = await db.video.findMany({
      where: {
        episodeId,
      },
      orderBy: {
        order: 'desc',
      },
    })

    return videos
  } catch (error) {
    throw new Error('비디오 요청중 에러가 발생하였습니다.')
  }
}

export const getVideoByIdWithUserAndRequest = async (
  videoId: string,
): Promise<VideoWithUserAndRequest> => {
  try {
    const video = await db.video.findUnique({
      where: {
        id: videoId,
      },
      include: {
        videoRequest: true,
        user: true,
      },
    })

    return video!
  } catch (error) {
    throw new Error('비디오 요청중 에러가 발생하였습니다.')
  }
}
