import { getEpisodesWithIsFavorite } from '@/app/data/episode'
import { NavContainer } from '@/components/nav-container'
import { EpisodeList } from './_components/episode-list'

const Page = async ({ searchParams }: { searchParams?: { find: string } }) => {
  const search = searchParams?.find

  const episodesRes = await getEpisodesWithIsFavorite(
    undefined,
    undefined,
    search,
  )
  const { data: episodes, cursorId } = episodesRes

  return (
    <NavContainer>
      <div className='grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 p-6 gap-6'>
        <EpisodeList search={search!} episodes={episodes} cursorId={cursorId} />
      </div>
    </NavContainer>
  )
}

export default Page
