'use server'

import { checkOwner } from '@/lib/access'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/app/data/user'
import {
  EpisodeWithIsFavorite,
  EpisodeWithVideos,
  EpisodeWithVideosAndUser,
  WithCursor,
} from '@/type'
import { Episode, RequestStatus } from '@prisma/client'

export const getEpisodesWithIsFavorite = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<EpisodeWithIsFavorite[]>> => {
  try {
    const userId = await getCurrentUserId()

    await checkOwner(userId)

    const episodes = await db.episode.findMany({
      where: {
        episodeRequest: {
          status: RequestStatus.APPROVED,
        },
      },
      include: {
        favorites: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take,
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
    })

    const episodesWithIsFavorite = episodes.map((episode) => ({
      ...episode,
      isFavorite: episode.favorites.length > 0,
    }))

    const lastEpisode =
      episodesWithIsFavorite[episodesWithIsFavorite.length - 1]
    const cursorId = lastEpisode.id ?? null

    return { data: episodesWithIsFavorite, cursorId }
  } catch (error) {
    throw new Error('에피소드를 가져오는 중에 에러가 발생하였습니다.')
  }
}

export const getEpisodeByIdWithVideos = async (
  episodeId: string,
): Promise<EpisodeWithVideos> => {
  try {
    const episode = await db.episode.findUnique({
      where: {
        id: episodeId,
      },
      include: {
        videos: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!episode) throw new Error('존재하지 않은 에피소드 입니다.')

    return episode
  } catch (error) {
    throw new Error('에피소드 정보를 가져오는 중에 에러가 발생하였습니다.')
  }
}

export const getMyFavoriteEpisodes = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<Episode[]>> => {
  try {
    const userId = await getCurrentUserId()

    await checkOwner(userId)

    const episodes = await db.episode.findMany({
      where: {
        favorites: {
          some: { userId },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take,
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
    })
    if (!episodes) throw new Error('존재하지 않은 에피소드 입니다.')

    const lastEpisode = episodes[episodes.length - 1]
    const cursorId = lastEpisode.id ?? null

    return { data: episodes, cursorId }
  } catch (error) {
    throw new Error('에피소드를 가져오는 중에 에러가 발생하였습니다.')
  }
}

export const getMyUploadedEpisodes = async (
  cursor?: string,
  take = 10,
): Promise<WithCursor<Episode[]>> => {
  try {
    const userId = await getCurrentUserId()

    await checkOwner(userId)

    const episodes = await db.episode.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take,
      ...(cursor && { cursor: { id: cursor } }),
      skip: cursor ? 1 : 0,
    })
    if (!episodes) throw new Error('존재하지 않은 에피소드 입니다.')

    const lastEpisode = episodes[episodes.length - 1]
    const cursorId = lastEpisode.id ?? null

    return { data: episodes, cursorId }
  } catch (error) {
    throw new Error('에피소드를 가져오는 중에 에러가 발생하였습니다.')
  }
}

export const getEpisodeByIdWithVideosAndUser = async (
  episodeId: string,
): Promise<EpisodeWithVideosAndUser> => {
  try {
    const episode = await db.episode.findUnique({
      where: {
        id: episodeId,
      },
      include: {
        videos: true,
        user: true,
      },
    })
    if (!episode) throw new Error('존재하지 않은 에피소드 입니다.')

    return episode
  } catch (error) {
    throw new Error('에피소드를 가져오는 중에 에러가 발생하였습니다.')
  }
}

export const getEpisodeCompletionStatus = async (
  episodeId: string,
): Promise<{ count: number; isCompleted: boolean }> => {
  try {
    const episode = await db.episode.findUnique({
      where: {
        id: episodeId,
      },
      select: {
        title: true,
        airDate: true,
        endDate: true,
        totalEpisodeCount: true,
        description: true,
        thumbnailUrl: true,
        categories: true,
      },
    })

    if (!episode) throw new Error('현재 에피소드가 존재하지 않습니다.')

    type EpisodeFields = {
      title: string
      airDate: Date | null
      endDate: Date | null
      totalEpisodeCount: number | null
      description: string | null
      thumbnailUrl: string | null
      categories: string[]
    }

    const fieldsToCheck: (keyof EpisodeFields)[] = [
      'title',
      'airDate',
      'endDate',
      'totalEpisodeCount',
      'description',
      'thumbnailUrl',
      'categories',
    ]

    const filledFieldsCount = fieldsToCheck.reduce((count, field) => {
      const value = episode[field as keyof EpisodeFields]

      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          return value.length > 0 ? count + 1 : count
        }
        return count + 1
      }
      return count
    }, 0)

    return {
      count: filledFieldsCount,
      isCompleted: fieldsToCheck.length === filledFieldsCount,
    }
  } catch (error) {
    throw new Error(
      '에피소드 데이터의 완성 상태를 확인하는 중에 에러가 발생하였습니다.',
    )
  }
}