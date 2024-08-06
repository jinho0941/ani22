'use server'

import { db } from '@/lib/db'
import { VideoComment } from '@prisma/client'

export const getVideoCommentsByVideoId = (
  videoId: string,
): Promise<VideoComment[]> => {
  try {
    const comments = db.videoComment.findMany({
      where: { videoId },
    })

    return comments
  } catch (error) {
    throw new Error('비디오 댓글을 가져오는중 에러가 발생하였습니다.')
  }
}
