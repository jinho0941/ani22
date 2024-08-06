'use server'

import { ActionType } from '@/type'
import { EpisodeRequest, RequestStatus } from '@prisma/client'
import { getCurrentUserId, isCurrentUserAdmin } from '@/app/data/user'
import { db } from '@/lib/db'
import { getEpisodeCompletionStatus } from '../data/episode'
import { checkAdmin, checkOwner, checkUploader } from '@/lib/access'

export type SendEpisodeRequestProps = {
  episodeId: string
}

export const sendEpisodeApprovalRequest = async ({
  episodeId,
}: SendEpisodeRequestProps): Promise<ActionType<EpisodeRequest>> => {
  try {
    await checkUploader()

    const userId = await getCurrentUserId()

    await checkOwner(userId)

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
    await checkAdmin()

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
    await checkAdmin()

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