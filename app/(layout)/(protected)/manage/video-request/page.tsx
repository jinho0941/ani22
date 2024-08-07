import { getVideoRequestsWithUserAndVideo } from '@/app/data/video-request'
import { NavContainer } from '@/components/nav-container'
import { RequestList } from './_components/request-list'

const Page = async () => {
  const requestsRes = await getVideoRequestsWithUserAndVideo()
  const { data: requests, cursorId } = requestsRes

  return (
    <NavContainer>
      <section className='max-w-screen-2xl mx-auto lg-px-0 px-2'>
        <div className='flex flex-col p-4 bg-slate-200 dark:bg-slate-900 rounded-md gap-y-4'>
          <RequestList requests={requests} cursorId={cursorId} />
        </div>
      </section>
    </NavContainer>
  )
}

export default Page
