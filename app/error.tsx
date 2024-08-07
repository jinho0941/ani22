'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BiError } from 'react-icons/bi'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className='h-screen bg-stone-100 dark:bg-slate-700 flex justify-center items-center'>
      <section className='flex md:flex-row flex-col items-center md:px-0 px-4'>
        <BiError className='h-52 w-52 text-rose-500' />
        <div>
          <h2 className='text-5xl font-bold'>Oops!!</h2>
          <p className='mt-3 text-xl font-semibold text-rose-500'>
            {error.message}
          </p>
          <p className='mt-1'>
            홈페이지로 돌아가서 <span className='font-bold'>다시 시도</span>
            해주세요.
          </p>
          <p className='mt-1'>
            만약 문제가 계속 발생한다면 관리자에게
            <span className='font-bold'>문의</span>해주십시오.
          </p>
          <div className='mt-4 grid grid-cols-2 gap-x-4'>
            <Button asChild>
              <Link href={'/'}>홈페이지로 돌아가기</Link>
            </Button>
            <Button>관리자에게 문의하기</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
