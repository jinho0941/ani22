'use server'

import { ActionType } from '@/type'
import { EpisodeRequest, RequestStatus } from '@prisma/client'
import {
  getCurrentUserId,
  isCurrentUserAdmin,
  isCurrentUserUploaderOrAdmin,
} from '@/app/data/user'
import { db } from '@/lib/db'
import { getEpisodeCompletionStatus } from '../data/episode'
export type SendEpisodeApprovalRequestProps = {
  episodeId: string
}

export const sendEpisodeApprovalRequest = async ({
  episodeId,
}: SendEpisodeApprovalRequestProps): Promise<ActionType<EpisodeRequest>> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId)
      return {
        success: false,
        message: '현재 로그인이 되어있지 않습니다.',
      }

    const isUploader = await isCurrentUserUploaderOrAdmin()
    if (!isUploader)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

    const existingRequest = await db.episodeRequest.findFirst({
      where: {
        episodeId,
        userId,
      },
    })

    if (existingRequest) {
      return { success: false, message: '이미 배포 신청이 접수되었습니다.' }
    }

    const { isCompleted } = await getEpisodeCompletionStatus(episodeId)
    if (!isCompleted)
      return { success: false, message: '모든 항목을 채워주세요.' }

    const isAdmin = await isCurrentUserAdmin()

    let episodeRequest
    if (isAdmin) {
      episodeRequest = await db.episodeRequest.create({
        data: {
          episodeId,
          userId,
          status: RequestStatus.APPROVED,
        },
      })
    } else {
      episodeRequest = await db.episodeRequest.create({
        data: {
          episodeId,
          userId,
          status: RequestStatus.PENDING,
        },
      })
    }

    if (!episodeRequest) {
      return { success: false, message: '배포 신청에 실패하였습니다.' }
    }

    return {
      success: true,
      message: '배포 신청에 성공하였습니다.',
      data: episodeRequest,
    }
  } catch (error) {
    return { success: false, message: '배포 신청 중에 에러가 발생하였습니다.' }
  }
}

export type ApprovalEpisodeRequestProps = {
  requestId: string
}

export const approvalEpisodeRequest = async ({
  requestId,
}: ApprovalEpisodeRequestProps): Promise<ActionType<EpisodeRequest>> => {
  try {
    const isAdmin = await isCurrentUserAdmin()

    if (!isAdmin)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

    const episodeRequest = await db.episodeRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.APPROVED,
      },
    })
    if (!episodeRequest)
      return { success: false, message: '승인 요청에 문제가 있습니다.' }

    return {
      success: true,
      message: '승인 요청이 완료되었습니다.',
      data: episodeRequest,
    }
  } catch (error) {
    return { success: false, message: '승인중에 에러가 발생하였습니다.' }
  }
}

export type RejectEpisodeRequestProps = {
  requestId: string
}
export const rejectEpisodeRequest = async ({
  requestId,
}: RejectEpisodeRequestProps): Promise<ActionType<EpisodeRequest>> => {
  try {
    const isAdmin = await isCurrentUserAdmin()

    if (!isAdmin)
      return {
        success: false,
        message: '권한이 없는 유저입니다.',
      }

    const episodeRequest = await db.episodeRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.REJECTED,
      },
    })
    if (!episodeRequest)
      return { success: false, message: '승인 요청에 문제가 있습니다.' }

    return {
      success: true,
      message: '거절 요청이 완료되었습니다.',
      data: episodeRequest,
    }
  } catch (error) {
    return { success: false, message: '승인중에 에러가 발생하였습니다.' }
  }
}

export type DeleteEpisodeRequestProps = {
  episodeId: string
}
export const deleteEpisodeRequest = async ({
  episodeId,
}: DeleteEpisodeRequestProps): Promise<ActionType<EpisodeRequest>> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId)
      return {
        success: false,
        message: '현재 로그인이 되어있지 않습니다.',
      }

    const existingRequest = await db.episodeRequest.findFirst({
      where: {
        episodeId,
        userId,
        status: 'PENDING',
      },
    })

    if (!existingRequest) {
      return { success: false, message: '신청이 존재하지 않습니다.' }
    }

    await db.episodeRequest.delete({
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

export type SetPendingEpisodeRequestProps = {
  episodeId: string
}
export const setPendingEpisodeRequest = async ({
  episodeId,
}: SetPendingEpisodeRequestProps): Promise<ActionType<EpisodeRequest>> => {
  try {
    const checkRequest = await db.episodeRequest.findUnique({
      where: {
        episodeId,
      },
    })
    if (!checkRequest)
      return { success: false, message: '존재하지 않는 요청입니다.' }

    const request = await db.episodeRequest.update({
      where: {
        episodeId,
      },
      data: {
        status: RequestStatus.PENDING,
      },
    })

    return { success: true, message: '신청 상태를 업데이트 하였습니다.' }
  } catch (error) {
    return { success: false, message: '신청 변경 중에 에러가 발생하였습니다.' }
  }
}
