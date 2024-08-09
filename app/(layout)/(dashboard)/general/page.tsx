import { getMyFavoriteEpisodes } from '@/app/data/episode'
import { EpisodeList } from './_components/episode-list'

const Page = async () => {
  const episodesRes = await getMyFavoriteEpisodes()
  const { data: episodes, cursorId } = episodesRes

  return <EpisodeList episodes={episodes} cursorId={cursorId} />
}

export default Page
