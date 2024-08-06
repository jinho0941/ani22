import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = {
  isLink?: boolean
}

export const Logo = ({ isLink = false }: Props) => {
  if (!isLink)
    return (
      <div className='text-2xl border-b pb-1 px-1 border-black dark:border-white'>
        Ani22
      </div>
    )

  return (
    <Button variant={'ghost'} className='p-1' asChild>
      <Link href={'/'}>
        <div className='text-2xl border-b pb-1 px-1 border-black dark:border-white'>
          Ani22
        </div>
      </Link>
    </Button>
  )
}
