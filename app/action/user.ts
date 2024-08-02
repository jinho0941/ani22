'use server'

import { signIn, signOut } from '@/auth'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/utils'
import { LoginSchema, RegisterSchema } from '@/schema'
import { ActionType, LoginSchemaType, RegisterSchemaType } from '@/type'
import { User } from '@prisma/client'
import { AuthError } from 'next-auth'

export const register = async (
  form: RegisterSchemaType,
): Promise<ActionType<User>> => {
  try {
    const validate = RegisterSchema.safeParse(form)
    if (!validate.success)
      return { success: false, message: '올바른 값을 입력해 주세요.' }

    const { email, password, nickname } = validate.data

    const checkExistingUser = await db.user.findUnique({
      where: {
        email,
      },
    })
    if (checkExistingUser)
      return { success: false, message: '이미 사용중인 이메일입니다.' }

    const hashedPassword = hashPassword(password)

    const createUser = await db.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: '회원가입에 성공하였습니다.',
      data: createUser,
    }
  } catch (error) {
    console.log(error)
    return { success: false, message: '회원가입 중에 에러가 발생하였습니다.' }
  }
}

export const login = async (
  form: LoginSchemaType,
): Promise<ActionType<null>> => {
  try {
    const validate = LoginSchema.safeParse(form)
    if (!validate.success)
      return { success: false, message: '올바른 값을 입력해 주세요.' }

    const { email, password } = validate.data

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return {
      success: true,
      message: '로그인에 성공하였습니다.',
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, message: '잘못된 인증입니다.' }
        default:
          return {
            success: false,
            message: '이메일이나 패스워드가 잘못되었습니다.',
          }
      }
    }
    return { success: false, message: '로그인 중에 에러가 발생하였습니다.' }
  }
}

export const logout = async (): Promise<ActionType<null>> => {
  try {
    await signOut({ redirect: false })
    return { success: true, message: '로그아웃에 성공 하였습니다.' }
  } catch (error) {
    return { success: false, message: '로그아웃에 실패 하였습니다.' }
  }
}

export const editUserImg = async () => {}

export const editUserNickname = async () => {}
