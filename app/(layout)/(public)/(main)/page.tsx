import { getEpisodesWithIsFavorite } from '@/app/data/episode'

const Page = async () => {
  const episodes = await getEpisodesWithIsFavorite()

  return <div></div>
}

export default Page
