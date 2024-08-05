'use server'

import {
  getCurrentUserId,
  isCurrentUserAdmin,
  isCurrentUserUploaderOrAdmin,
} from '@/app/data/user'

const message = '접근권한이 없는 유저입니다.'

export const checkAdmin = async () => {
  const isAdmin = await isCurrentUserAdmin()
  if (!isAdmin) throw new Error(message)
}

export const checkUploader = async () => {
  const isUploader = await isCurrentUserUploaderOrAdmin()
  if (!isUploader) throw new Error(message)
}

export const checkOwner = async (userId: string) => {
  const currentUserId = await getCurrentUserId()

  if (currentUserId !== userId) throw new Error(message)
}
