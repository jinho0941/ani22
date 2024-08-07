'use server'

import { ActionType } from '@/type'
import { RequestStatus, VideoRequest } from '@prisma/client'
import {
  getCurrentUserId,
  isCurrentUserAdmin,
  isCurrentUserUploaderOrAdmin,
} from '@/app/data/user'
import { db } from '@/lib/db'
import { getVideoCompletionStatus } from '@/app/data/video'

export type SendApprovalVideoRequestProps = {
  videoId: string
}

export const sendApprovalVideoRequest = async ({
  videoId,
}: SendApprovalVideoRequestProps): Promise<ActionType<VideoRequest>> => {
  try {
    const isUploader = await isCurrentUserUploaderOrAdmin()

    if (!isUploader)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

    const userId = await getCurrentUserId()
    if (!userId)
      return {
        success: false,
        message: '현재 로그인이 되어있지 않습니다.',
      }

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
    const isAdmin = await isCurrentUserAdmin()

    if (!isAdmin)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

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
    const isAdmin = await isCurrentUserAdmin()

    if (!isAdmin)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

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

export const deleteVideoRequest = async (
  videoId: string,
): Promise<ActionType<VideoRequest>> => {
  try {
    const userId = await getCurrentUserId()

    if (!userId)
      return {
        success: false,
        message: '로그인을 해주세요.',
      }

    const existingRequest = await db.videoRequest.findUnique({
      where: {
        videoId,
        userId,
        status: 'PENDING',
      },
    })

    if (!existingRequest) {
      return { success: false, message: '신청이 존재하지 않습니다.' }
    }

    await db.videoRequest.delete({
      where: {
        id: existingRequest.id,
      },
    })

    return {
      success: true,
      message: '신청이 취소되었습니다.',
    }
  } catch (error) {
    return { success: false, message: '신청 취소 중에 에러가 발생하였습니다.' }
  }
}

export type SetPendingVideoRequestProps = {
  videoId: string
}
export const setPendingVideoRequest = async ({
  videoId,
}: SetPendingVideoRequestProps): Promise<ActionType<VideoRequest>> => {
  try {
    const checkRequest = await db.videoRequest.findUnique({
      where: { videoId },
    })
    if (!checkRequest)
      return { success: false, message: '존재하지 않는 요청입니다.' }

    const request = await db.videoRequest.update({
      where: { videoId },
      data: {
        status: RequestStatus.PENDING,
      },
    })

    return { success: true, message: '요청 상태를 업데이트 하였습니다.' }
  } catch (error) {
    return { success: false, message: '신청 변경 중에 에러가 발생하였습니다.' }
  }
}
