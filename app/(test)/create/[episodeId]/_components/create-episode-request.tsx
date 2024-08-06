import { updateEpisode, UpdateEpisodeProps } from '@/app/action/episode'
import {
  sendEpisodeApprovalRequest,
  SendEpisodeApprovalRequestProps,
} from '@/app/action/episode-request'
import { ActionButton } from '@/components/action-button'
import { faker } from '@faker-js/faker'
import { Episode, EpisodeRequest } from '@prisma/client'

type Props = {
  episodeId: string
  episode: Episode
  request: EpisodeRequest
}

export const CreateEpisodeRequest = ({
  episode,
  episodeId,
  request,
}: Props) => {
  return (
    <div className='space-y-4'>
      <ActionButton<SendEpisodeApprovalRequestProps, EpisodeRequest>
        fn={sendEpisodeApprovalRequest}
        param={{ episodeId }}
      >
        create episode request
      </ActionButton>
      <div className='p-4 bg-white space-y-2 rounded-md'>
        <div>requestStatus: {request ? request.status : '요청없음'}</div>
        <div className='font-bold'>Episode Info</div>
        <ActionButton<UpdateEpisodeProps, Episode>
          fn={updateEpisode}
          param={{
            episodeId,
            title: faker.word.words(1),
            description: faker.word.words(8),
            thumbnailUrl: faker.image.url(),
            airDate: faker.date.past(),
            endDate: faker.date.future(),
            totalEpisodeCount: faker.number.int({ min: 4, max: 18 }),
            categories: Array.from({ length: 5 }, () => faker.word.words(1)),
          }}
        >
          모든 항목 채우기
        </ActionButton>
        <div>title: {episode.title}</div>
        <div>description: {episode.description}</div>
        <div>thumbnailUrl: {episode.thumbnailUrl}</div>
        <div>airDate: {episode.airDate?.toString()}</div>
        <div>endDate: {episode.endDate?.toString()}</div>
        <div>totalEpisodeCount: {episode.totalEpisodeCount}</div>
        <div>categories: {episode.categories}</div>
      </div>
    </div>
  )
}
