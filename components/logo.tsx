import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Logo = () => {
  return (
    <Button variant={'ghost'} className='p-1' asChild>
      <Link href={'/'}>
        <div className='text-4xl border-b pb-2 px-1 border-black dark:border-white'>
          Ani22
        </div>
      </Link>
    </Button>
  )
}
