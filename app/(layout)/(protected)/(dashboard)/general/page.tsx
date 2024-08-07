import { getMyFavoriteEpisodes } from '@/app/data/episode'
import { EpisodeList } from './_components/episode-list'

const Page = async () => {
  // const episodesRes = await getMyFavoriteEpisodes()
  // const { data: episodes, cursorId } = episodesRes

  return (
    <div>
      {/* <h2 className='lg:text-2xl text-lg font-bold'>
        <span className='lg:text-xl text-sm font-medium'>pick</span>
        <span className='ml-1'>에피소드</span>
        <div className='mt-6 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6'>
          <EpisodeList episodes={episodes} cursorId={cursorId} />
        </div>
      </h2> */}
    </div>
  )
}

export default Page
