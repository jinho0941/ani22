'use server'

import { ActionType } from '@/type'
import { RequestStatus, VideoRequest } from '@prisma/client'
import { getCurrentUserId, isCurrentUserAdmin } from '@/app/data/user'
import { db } from '@/lib/db'
import { getVideoCompletionStatus } from '@/app/data/video'
import { checkAdmin, checkUploader } from '@/lib/access'

export type SendApprovalVideoRequestProps = {
  videoId: string
}

export const sendApprovalVideoRequest = async ({
  videoId,
}: SendApprovalVideoRequestProps): Promise<ActionType<VideoRequest>> => {
  try {
    await checkUploader()

    const userId = await getCurrentUserId()

    const existingRequest = await db.videoRequest.findUnique({
      where: {
        videoId,
        userId,
      },
    })

    if (existingRequest) {
      return { success: false, message: '이미 배포 신청이 접수되었습니다.' }
    }

    const { isCompleted } = await getVideoCompletionStatus(videoId)
    if (!isCompleted)
      return { success: false, message: '모든 항목을 채워주세요.' }

    let videoRequest

    const isAdmin = await isCurrentUserAdmin()
    if (isAdmin) {
      videoRequest = await db.videoRequest.create({
        data: {
          videoId,
          userId,
          status: RequestStatus.APPROVED,
        },
      })
    } else {
      videoRequest = await db.videoRequest.create({
        data: {
          videoId,
          userId,
          status: RequestStatus.PENDING,
        },
      })
    }

    if (!videoRequest) {
      return { success: false, message: '배포 신청에 실패하였습니다.' }
    }

    return {
      success: true,
      message: '배포 신청에 성공하였습니다.',
      data: videoRequest,
    }
  } catch (error) {
    return { success: false, message: '배포 신청 중에 에러가 발생하였습니다.' }
  }
}

export type ApproveVideoRequestProps = {
  requestId: string
}
export const approveVideoRequest = async ({
  requestId,
}: ApproveVideoRequestProps): Promise<ActionType<VideoRequest>> => {
  try {
    await checkAdmin()

    const videoRequest = await db.videoRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.APPROVED,
      },
    })
    if (!videoRequest)
      return { success: false, message: '승인 요청에 문제가 있습니다.' }

    return {
      success: true,
      message: '승인 요청이 완료되었습니다.',
      data: videoRequest,
    }
  } catch (error) {
    return { success: false, message: '승인중에 에러가 발생하였습니다.' }
  }
}

export type RejectVideoRequestProps = {
  requestId: string
}
export const rejectVideoRequest = async ({
  requestId,
}: RejectVideoRequestProps): Promise<ActionType<VideoRequest>> => {
  try {
    await checkAdmin()

    const videoRequest = await db.videoRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.REJECTED,
      },
    })
    if (!videoRequest)
      return { success: false, message: '승인 요청에 문제가 있습니다.' }

    return {
      success: true,
      message: '거절 요청이 완료되었습니다.',
      data: videoRequest,
    }
  } catch (error) {
    return { success: false, message: '승인중에 에러가 발생하였습니다.' }
  }
}
