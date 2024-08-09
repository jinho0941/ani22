import { getMyUploadedEpisodes } from '@/app/data/episode'
import { EpisodeHeader } from './_components/episode-header'
import { CreateEpisodeButton } from './_components/create-episode-button'
import { EpisodeList } from './_components/episode-list'

const Page = async ({
  searchParams,
}: {
  searchParams: { search: string; order: 'new' | 'past' }
}) => {
  const search = searchParams.search ?? ''
  const order = searchParams.order ?? 'new'

  const episodesRes = await getMyUploadedEpisodes(
    undefined,
    undefined,
    order,
    search,
  )
  const { data: episodes, cursorId } = episodesRes

  return (
    <div className='mt-12 max-w-screen-2xl mx-auto'>
      <EpisodeHeader />
      <section className='mt-4 grid xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-4 gap-y-4'>
        <CreateEpisodeButton />
        <EpisodeList
          search={search}
          order={order}
          episodes={episodes}
          cursorId={cursorId}
        />
      </section>
    </div>
  )
}

export default Page
