import { z } from 'zod'
import { LoginSchema, RegisterSchema } from '@/schema'

export type ActionType<T> = {
  success: boolean
  message: string
  data?: T
}

export type RegisterSchemaType = z.infer<typeof RegisterSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>
