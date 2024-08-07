import { z } from 'zod'
import { LoginSchema, RegisterSchema } from '@/schema'
import {
  Episode,
  EpisodeRequest,
  User,
  UserRoleRequest,
  Video,
  VideoComment,
  VideoRequest,
} from '@prisma/client'

export type ActionType<T> = {
  success: boolean
  message: string
  data?: T
}

export type WithCursor<T> = {
  data: T
  cursorId: string | null
}

export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>

// episode request
export type EpisodeRequestWithUser = EpisodeRequest & {
  user: User
  episode: Episode
}

// episode
export type EpisodeWithIsFavorite = Episode & { isFavorite: boolean }
export type EpisodeWithVideos = Episode & { videos: Video[] }
export type EpisodeWithVideosAndUser = Episode & { videos: Video[]; user: User }
export type EpisodeWithRequest = Episode & {
  episodeRequest: EpisodeRequest | null
}
export type EpisodeWithRequestAndVideos = Episode & {
  episodeRequest: EpisodeRequest | null
  videos: VideoWithRequest[]
}

export type EpisodeWithUserAndRequestAndVideos = Episode & {
  user: User
  episodeRequest: EpisodeRequest | null
  videos: Video[]
}

// user role request
export type RoleRequestWithUser = UserRoleRequest & { user: User }

// video request
export type VideoRequestWithUserAndVideo = VideoRequest & {
  user: User
  video: Video
}

// video
export type VideoWithEpisodesAndComments = Video & {
  episode: Episode & {
    videos: Video[]
  }
  comments: (VideoComment & {
    user: User
  })[]
}
export type VideoWithUser = Video & { user: User }
export type VideoWithRequest = Video & { videoRequest: VideoRequest | null }
export type VideoWithUserAndRequest = Video & {
  user: User
  videoRequest: VideoRequest | null
}
