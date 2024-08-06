import { getCurrentUser } from '@/app/data/user'
import { NavContainer } from '@/components/nav-container'
import { UserTypeNavigation } from './_components/user-type-navigation'
import { UserProfile } from './_components/user-profile'
import { getCurrentUserRoleRequest } from '@/app/data/user-role-request'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser()
  const request = await getCurrentUserRoleRequest()
  const status = request?.status ?? null

  return (
    <NavContainer>
      <div className='max-w-screen-2xl mx-auto lg-px-0 px-2'>
        <UserTypeNavigation role={user.role} />
        <UserProfile
          userImg={user.imageUrl!}
          username={user.nickname}
          role={user.role}
          status={status}
        />
        <section className='mt-4 lg:mt-12'>{children}</section>
      </div>
      {children}
    </NavContainer>
  )
}

export default Layout
