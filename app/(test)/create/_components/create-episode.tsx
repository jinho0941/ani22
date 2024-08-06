import { createEpisode, CreateEpisodeProps } from '@/app/action/episode'
import { ActionButton } from '@/components/action-button'
import { Button } from '@/components/ui/button'
import { faker } from '@faker-js/faker'
import { Episode } from '@prisma/client'
import Link from 'next/link'

type Props = {
  episodes: Episode[]
}

export const CreateEpisode = ({ episodes }: Props) => {
  return (
    <div className='space-y-4'>
      <ActionButton<CreateEpisodeProps, Episode>
        fn={createEpisode}
        param={{ title: faker.word.words() }}
      >
        Create Episode
      </ActionButton>
      <div className='bg-white rounded-md h-80 text-white overflow-y-scroll p-4 flex flex-col gap-y-2 scrollbar-hide'>
        {episodes.map((episode) => (
          <Button asChild>
            <Link href={`/create/${episode.id}`}>{episode.title}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
