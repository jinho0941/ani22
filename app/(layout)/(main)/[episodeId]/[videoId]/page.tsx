import { format } from 'date-fns'

import { getVideoByIdWithEpisodesAndComments } from '@/app/data/video'
import { NavContainer } from '@/components/nav-container'

import { IncreaseViewCount } from './_components/increase-view-count'
import { VideoDescription } from './_components/video-description'
import { EpisodeHeader } from './_components/episode-header'
import { CommentInput } from './_components/comment-input'
import { VideoHeader } from './_components/video-header'

import { VideoPlayer } from './_components/video-player'
import { VideoList } from './_components/video-list'
import { Comment } from './_components/comment'

const Page = async ({ params }: { params: { videoId: string } }) => {
  const videoId = params.videoId
  const video = await getVideoByIdWithEpisodesAndComments(videoId)
  const episode = video.episode
  const episodeVideos = episode.videos
  const comments = video.comments

  return (
    <>
      <IncreaseViewCount videoId={videoId} />
      <NavContainer>
        <div className='max-w-[2360px] mx-auto md:mt-10 mt-0 md:p-5'>
          <div className='flex lg:flex-row flex-col lg:justify-center gap-x-8 lg:items-stretch'>
            <VideoPlayer src={video.url!} />
            <aside className='flex flex-col bg-slate-100 dark:bg-slate-800 lg:w-[650px] w-full rounded-md overflow-hidden'>
              <EpisodeHeader title={episode.title} />
              <VideoList episodeId={episode.id} videoList={episodeVideos} />
            </aside>
          </div>
          <section className='mx-2 lg:mx-0'>
            <div className='mt-4 flex justify-between lg:items-center lg:flex-row flex-col items-start gap-y-2'>
              <VideoHeader title={video.title} />
            </div>
            <VideoDescription
              views={video.views}
              monthsAgo={format(video.createdAt, 'yyyy.MM.dd')}
              rating='4.8'
              description={video.description!}
            />
          </section>
          <section className='mt-8 lg:mx-0 mx-2 max-w-7xl'>
            <CommentInput videoId={videoId} />
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                userImg={comment.user.imageUrl!}
                username={comment.user.nickname}
                date={format(comment.createdAt, 'yyyy-MM-dd')}
                content={comment.content}
              />
            ))}
          </section>
        </div>
      </NavContainer>
    </>
  )
}

export default Page
