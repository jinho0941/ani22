import z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({ message: '올바른 이메일 형식을 입력해 주세요.' }),
  password: z.string().min(8, { message: '비밀번호는 8글자 이상입니다.' }),
})

export const RegisterSchema = z
  .object({
    nickname: z
      .string()
      .min(1, { message: '닉네임을 입력해 주세요' })
      .max(10, { message: '닉네임은 최대 10글자까지 가능합니다' }),
    email: z.string().email({ message: '올바른 이메일 형식을 입력해 주세요' }),
    password: z.string().min(8, { message: '비밀번호는 8글자 이상입니다.' }),
    confirmPassword: z
      .string()
      .min(1, { message: '비밀번호를 재입력 해주세요' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })
