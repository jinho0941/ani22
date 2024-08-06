import { createVideo, CreateVideoProps } from '@/app/action/video'
import { ActionButton } from '@/components/action-button'
import { Button } from '@/components/ui/button'
import { faker } from '@faker-js/faker'
import { Video } from '@prisma/client'
import Link from 'next/link'

type Props = {
  episodeId: string
  videos: Video[]
}

export const CreateVideo = ({ episodeId, videos }: Props) => {
  return (
    <div className='space-y-4'>
      <ActionButton<CreateVideoProps, Video>
        fn={createVideo}
        param={{ episodeId, title: faker.word.words(1) }}
      >
        create video
      </ActionButton>
      <div className='p-4 bg-slate-500 rounded-md flex flex-col gap-y-2 overflow-y-scroll scrollbar-hide h-80'>
        {videos.map((video) => (
          <Button key={video.id} asChild>
            <Link href={`/create/${episodeId}/${video.id}`}>{video.title}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
