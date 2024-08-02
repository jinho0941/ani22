import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import bcrypt from 'bcryptjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10)
export const verifyPassword = (password: string, hashedPassword: string) =>
  bcrypt.compareSync(password, hashedPassword)
