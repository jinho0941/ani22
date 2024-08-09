import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { RequestStatus, UserRole } from '@prisma/client'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { RequestUserRoleButton } from './request-user-role-button'
import { Button } from '@/components/ui/button'
import { ReRequestUserRoleButton } from './re-request-user-role-button'

type Props = {
  userImg: string
  username: string
  role: UserRole
  status: RequestStatus | null
}

export const UserProfile = ({ userImg, username, role, status }: Props) => {
  const userTypeLabel =
    role === UserRole.ADMIN
      ? '관리자'
      : role === UserRole.UPLOADER
      ? '업로더'
      : '일반'

  return (
    <section className='lg:mt-12 mt-4'>
      <div className='flex gap-x-8 items-center'>
        <Avatar className='lg:h-40 lg:w-40 h-20 w-20 bg-slate-300 dark:bg-slate-900 border-2 border-black dark:border-white'>
          <AvatarImage src={userImg} className='object-cover' />
          <AvatarFallback>
            <span className='lg:text-5xl text-2xl'>U</span>
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-between gap-y-3'>
          <span className='lg:text-4xl text-xl font-extrabold'>{username}</span>
          <div className='lg:text-xl text-sm font-bold'>
            회원 등급:
            <span
              className={cn(
                'ml-1 text-blue-500',
                role === 'ADMIN' && 'text-rose-500',
                role === 'UPLOADER' && 'text-indigo-500',
              )}
            >
              {userTypeLabel}
            </span>
          </div>
          {role === UserRole.GENERAL && (
            <div className='flex lg:flex-row flex-col gap-x-4 lg:items-center gap-y-1'>
              <span className='flex items-center gap-x-1'>
                관리자에게 권한 신청
                <ArrowRight className='lg:block hidden' />
                <ArrowDown className='lg:hidden block' />
              </span>
              {status === RequestStatus.PENDING ? (
                <Button disabled>신청중...</Button>
              ) : status === RequestStatus.REJECTED ? (
                <ReRequestUserRoleButton />
              ) : (
                <RequestUserRoleButton />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
