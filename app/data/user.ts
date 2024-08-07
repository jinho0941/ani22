'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { User, UserRole } from '@prisma/client'

export const getCurrentUserEmail = async (): Promise<string | null> => {
  const session = await auth()
  if (!session) return null
  const email = session.user?.email
  if (!email) return null

  return email
}

export const getCurrentUserId = async (): Promise<string | null> => {
  const email = await getCurrentUserEmail()
  try {
    if (!email) return null
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    })

    if (!user) return null

    return user.id
  } catch (error) {
    return null
  }
}

export const getCurrentUser = async (): Promise<User> => {
  const email = await getCurrentUserEmail()
  try {
    if (!email) throw new Error('현재 로그인이 되어있지 않습니다.')
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) throw new Error('유저 조회에 실패하였습니다.')

    return user
  } catch (error) {
    throw new Error('유저 정보를 가져오는 중에 에러가 발생하였습니다.')
  }
}

export const isCurrentUserUploaderOrAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    return user.role === UserRole.ADMIN || user.role === UserRole.UPLOADER
  } catch (error) {
    throw new Error('유저 권한을 확인하는 중에 에러가 발생하였습니다.')
  }
}

export const isCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser()
    return user.role === UserRole.ADMIN
  } catch (error) {
    throw new Error('유저 권한을 확인하는 중에 에러가 발생하였습니다.')
  }
}

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    await getCurrentUser()
    return true
  } catch (error) {
    return false
  }
}

export const getAllUser = async (): Promise<User[]> => {
  try {
    const users = db.user.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return users
  } catch (error) {
    throw new Error('유저를 가져오는 중에 에러가 발생하였습니다.')
  }
}
