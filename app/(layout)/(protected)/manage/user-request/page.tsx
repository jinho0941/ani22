import { getUserRoleRequests } from '@/app/data/user-role-request'
import { NavContainer } from '@/components/nav-container'
import { RequestList } from './_components/request-list'

const UserRolePage = async () => {
  const requestsRes = await getUserRoleRequests()
  const { data: requests, cursorId } = requestsRes

  return (
    <NavContainer>
      <section className='max-w-screen-2xl mx-auto lg-px-0 px-2'>
        <div className='mt-8 space-y-4 p-4 bg-slate-200 dark:bg-slate-900 rounded-lg'>
          <section className='grid grid-cols-3 px-8'>
            <div>유저이름</div>
            <div className='hidden justify-center sm:flex'>제목</div>
            <div className='flex justify-end'>설정</div>
          </section>
          <RequestList requests={requests} cursorId={cursorId} />
        </div>
      </section>
    </NavContainer>
  )
}

export default UserRolePage
