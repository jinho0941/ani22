import { getVideoRequestByVideoId } from '@/app/data/video-request'
import { CreateVideoRequest } from './_components/create-video-request'
import { getVideoCommentsByVideoId } from '@/app/data/video-comment'
import { CreateVideoComment } from './_components/create-video-comment'
import { getVideoByIdWithEpisodesAndComments } from '@/app/data/video'

const Page = async ({ params }: { params: { videoId: string } }) => {
  const videoId = params.videoId
  const video = await getVideoByIdWithEpisodesAndComments(videoId)
  const request = await getVideoRequestByVideoId(videoId)
  const comments = await getVideoCommentsByVideoId(videoId)

  return (
    <div className='w-[800px] grid grid-cols-2 gap-4'>
      <CreateVideoRequest request={request} videoId={videoId} video={video} />
      <CreateVideoComment videoId={videoId} comments={comments} />
    </div>
  )
}

export default Page
