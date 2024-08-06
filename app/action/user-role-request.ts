'use server'

import { ActionType } from '@/type'
import { RequestStatus, UserRoleRequest } from '@prisma/client'
import { getCurrentUserId, isCurrentUserUploaderOrAdmin } from '../data/user'
import { db } from '@/lib/db'
import { checkAdmin } from '@/lib/access'

export type SendUploaderApprovalRequestProps = {
  title: string
  content: string
}

export const sendUploaderApprovalRequest = async ({
  title,
  content,
}: SendUploaderApprovalRequestProps): Promise<ActionType<UserRoleRequest>> => {
  try {
    const userId = await getCurrentUserId()

    const isUploader = await isCurrentUserUploaderOrAdmin()
    if (isUploader) {
      return { success: false, message: '이미 권한이 있는 유저입니다.' }
    }

    const userRoleRequest = await db.userRoleRequest.create({
      data: {
        userId,
        title,
        content,
      },
    })
    if (!userRoleRequest)
      return { success: false, message: '권한 요청이 생성되지 않았습니다.' }

    return {
      success: true,
      message: '요청 생성에 성공하였습니다.',
      data: userRoleRequest,
    }
  } catch (error) {
    return { success: false, message: '유저 권한 생성에 실패하였습니다.' }
  }
}

export type ApproveUploaderRequestProps = {
  requestId: string
}

export const approveUploaderRequest = async ({
  requestId,
}: ApproveUploaderRequestProps): Promise<ActionType<UserRoleRequest>> => {
  try {
    await checkAdmin()

    const request = await db.userRoleRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.APPROVED,
      },
    })

    if (!request)
      return { success: false, message: '승인 요청에 실패하였습니다.' }

    return { success: true, message: '승인 요청에 성공하였습니다.' }
  } catch (error) {
    return { success: false, message: '승인 요청중에 에러가 발생하였습니다' }
  }
}

export type RejectUploaderRequestProps = {
  requestId: string
}
export const rejectUploaderRequest = async ({
  requestId,
}: RejectUploaderRequestProps): Promise<ActionType<UserRoleRequest>> => {
  try {
    await checkAdmin()

    const request = await db.userRoleRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: RequestStatus.REJECTED,
      },
    })

    if (!request)
      return { success: false, message: '승인 요청에 실패하였습니다.' }

    return { success: true, message: '승인 요청에 성공하였습니다.' }
  } catch (error) {
    return { success: false, message: '승인 요청중에 에러가 발생하였습니다' }
  }
}
