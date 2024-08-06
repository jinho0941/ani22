import {
  createVideoComment,
  CreateVideoCommentProps,
} from '@/app/action/video-comment'
import { ActionButton } from '@/components/action-button'
import { faker } from '@faker-js/faker'
import { VideoComment } from '@prisma/client'

type Props = {
  videoId: string
  comments: VideoComment[]
}

export const CreateVideoComment = ({ videoId, comments }: Props) => {
  return (
    <div className='space-y-4'>
      <ActionButton<CreateVideoCommentProps, VideoComment>
        fn={createVideoComment}
        param={{ videoId, content: faker.word.words(8) }}
      >
        create video comment
      </ActionButton>
      <div className='bg-slate-500 rounded-md h-80 overflow-y-scroll scrollbar-hide space-y-2 p-4'>
        {comments.map((comment) => (
          <div key={comment.id} className='p-2 bg-slate-600 rounded-md'>
            {comment.content}
          </div>
        ))}
      </div>
    </div>
  )
}
