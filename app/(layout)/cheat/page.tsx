'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import {
  createRandomUsers,
  createRandomEpisodesAndRelatedData,
  createUserRoleRequests,
  createPendingEpisodes,
  createPendingVideos,
} from './action/cheat'

const Page = () => {
  const [isPending, startTransition] = useTransition()

  const handleAction = (action: () => Promise<any>, successMessage: string) => {
    startTransition(async () => {
      try {
        await action()
        toast.success(successMessage)
      } catch (error) {
        toast.error('작업 실행 중 오류가 발생했습니다.')
        console.error(error)
      }
    })
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        데이터 생성 치트 페이지
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <CheatCard title='사용자 생성'>
          <Button
            onClick={() =>
              handleAction(
                () => createRandomUsers(10, 'GENERAL'),
                '일반 사용자 10명 생성 완료',
              )
            }
            className='w-full mb-2'
          >
            일반 사용자 10명 생성
          </Button>
          <Button
            onClick={() =>
              handleAction(
                () => createRandomUsers(10, 'UPLOADER'),
                '업로더 10명 생성 완료',
              )
            }
            className='w-full mb-2'
          >
            업로더 10명 생성
          </Button>
          <Button
            onClick={() =>
              handleAction(
                () => createRandomUsers(10, 'ADMIN'),
                '관리자 10명 생성 완료',
              )
            }
            className='w-full'
          >
            관리자 10명 생성
          </Button>
        </CheatCard>

        <CheatCard title='콘텐츠 생성'>
          <Button
            onClick={() =>
              handleAction(
                () => createRandomEpisodesAndRelatedData(10),
                '에피소드 및 관련 데이터 10개 생성 완료',
              )
            }
            className='w-full mb-2'
          >
            에피소드 및 관련 데이터 10개 생성
          </Button>
          <Button
            onClick={() =>
              handleAction(
                () => createPendingEpisodes(10),
                '대기 중인 에피소드 10개 생성 완료',
              )
            }
            className='w-full mb-2'
          >
            대기 중인 에피소드 10개 생성
          </Button>
          <Button
            onClick={() =>
              handleAction(
                () => createPendingVideos(10),
                '대기 중인 비디오 10개 생성 완료',
              )
            }
            className='w-full'
          >
            대기 중인 비디오 10개 생성
          </Button>
        </CheatCard>

        <CheatCard title='기타 작업'>
          <Button
            onClick={() =>
              handleAction(
                () => createUserRoleRequests(10),
                '사용자 역할 변경 요청 10개 생성 완료',
              )
            }
            className='w-full'
          >
            일반 사용자 업로더 업글 요청 10개 생성
          </Button>
        </CheatCard>
      </div>
      {isPending && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white p-4 rounded-lg flex items-center text-black'>
            <Loader2 className='animate-spin mr-2' />
            <span>처리 중...</span>
          </div>
        </div>
      )}
    </div>
  )
}

type Props = {
  title: string
  children: React.ReactNode
}

const CheatCard = ({ title, children }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

export default Page
