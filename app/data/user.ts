'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { User } from '@prisma/client'

export const getCurrentUserEmail = async (): Promise<string> => {
  try {
    const session = await auth()
    if (!session) throw new Error('현재 로그인되어있지 않습니다.')
    const email = session.user?.email
    if (!email) throw new Error('존재하지 않는 이메일 입니다.')

    return email
  } catch (error) {
    throw new Error('이메일을 가져오는중에 에러가 발생하였습니다.')
  }
}

export const getCurrentUserId = async (): Promise<string> => {
  try {
    const email = await getCurrentUserEmail()

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    })

    if (!user) throw new Error('존재하지 않는 유저 아이디 입니다.')

    return user.id
  } catch (error) {
    throw new Error('유저 아이디를 가져오는중에 에러가 발생하였습니다.')
  }
}

export const getCurrentUser = async (): Promise<User> => {
  try {
    const email = await getCurrentUserEmail()
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
