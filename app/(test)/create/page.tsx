import { getMyUploadedEpisodes } from '@/app/data/episode'
import { getAllUser } from '@/app/data/user'
import { CreateEpisode } from './_components/create-episode'
import { CreateUser } from './_components/create-user'
import { CreateUserRoleRequest } from './_components/create-user-role-request'

const Page = async () => {
  const episodeRes = await getMyUploadedEpisodes(undefined, 100)
  const episodes = episodeRes.data

  const users = await getAllUser()

  return (
    <div className='w-[800px] grid grid-cols-2 gap-4'>
      <CreateEpisode episodes={episodes} />
      <CreateUser users={users} />
      <CreateUserRoleRequest />
    </div>
  )
}

export default Page
