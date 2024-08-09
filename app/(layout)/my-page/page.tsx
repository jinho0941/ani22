import { getCurrentUser } from '@/app/data/user'
import { NavContainer } from '@/components/nav-container'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { UserRole } from '@prisma/client'
import { EditNicknameForm } from './_components/edit-nickname-form'
import { EditPasswordForm } from './_components/edit-password-form'
import EditImageForm from './_components/edit-image-form'

const Page = async () => {
  const user = await getCurrentUser()

  return (
    <NavContainer>
      <div className='mt-10 max-w-5xl mx-auto lg:px-0 px-4'>
        <div className='flex flex-col items-center gap-y-4'>
          <EditImageForm userImg={user.imageUrl!} />
          <div className='font-bold text-2xl'>
            <span
              className={cn(
                user.role === UserRole.GENERAL && 'text-indigo-500',
                user.role === UserRole.UPLOADER && 'text-blue-500',
                user.role === UserRole.ADMIN && 'text-rose-500',
              )}
            >
              {user.role}
            </span>
            <span className='ml-2'> {user.nickname}</span>
          </div>
          <div className='text-xl'>{user.email}</div>
          <EditNicknameForm nickname={user.nickname} />
          <EditPasswordForm />
        </div>
      </div>
    </NavContainer>
  )
}

export default Page
