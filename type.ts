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
export type EpisodeRequestWithUser = EpisodeRequest & { user: User }

// episode
export type EpisodeWithIsFavorite = Episode & { isFavorite: boolean }
export type EpisodeWithVideos = Episode & { videos: Video[] }
export type EpisodeWithVideosAndUser = Episode & { videos: Video[]; user: User }

// user role request
export type RoleRequestWithUser = UserRoleRequest & { user: User }

// video request
export type VideoRequestWithUser = VideoRequest & { user: User }

// video
export type VideoWithEpisodesAndComments = Video & {
  episode: Episode & { videos: Video[] }
  comments: VideoComment[]
}
export type VideoWithUser = Video & { user: User }
