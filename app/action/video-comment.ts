'use server'

import { getCurrentUserId } from '@/app/data/user'
import { db } from '@/lib/db'
import { ActionType } from '@/type'
import { VideoComment } from '@prisma/client'

export type CreateVideoCommentProps = {
  videoId: string
  content: string
}

export const createVideoComment = async ({
  videoId,
  content,
}: CreateVideoCommentProps): Promise<ActionType<VideoComment>> => {
  try {
    const userId = await getCurrentUserId()

    const comment = await db.videoComment.create({
      data: {
        userId,
        videoId,
        content,
      },
    })
    if (!comment)
      return { success: false, message: '생성된 데이터가 존재하지않습니다.' }

    return { success: true, message: '댓글 생성에 성공하였습니다.' }
  } catch (error) {
    return { success: false, message: '댓글 생성에 실패하였습니다.' }
  }
}
