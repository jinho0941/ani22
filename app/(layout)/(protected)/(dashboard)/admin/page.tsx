import { Book, User, Video } from 'lucide-react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Page = () => {
  return (
    <div className='grid md:grid-cols-2 grid-cols-1 gap-y-12'>
      <div className='flex items-center gap-x-2'>
        <User />
        <span>유저 권한 관리 페이지</span>
        <Button asChild>
          <Link href={`/manage/user-request`}>유저 권한 요청</Link>
        </Button>
      </div>
      <div className='flex items-center gap-x-2'>
        <Book />
        <span>에피소드 신청 관리 페이지</span>
        <Button asChild>
          <Link href={`/manage/episode-request`}>에피소드 신청</Link>
        </Button>
      </div>
      <div className='flex items-center gap-x-2'>
        <Video />
        <span>비디오 신청 관리 페이지</span>
        <Button asChild>
          <Link href={`/manage/video-request`}>비디오 신청</Link>
        </Button>
      </div>
    </div>
  )
}

export default Page
