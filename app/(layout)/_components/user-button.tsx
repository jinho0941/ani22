'use client'

import { logout } from '@/app/action/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Props = {
  imgUrl: string
}

export const UserButton = ({ imgUrl }: Props) => {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none'>
        <Avatar>
          <AvatarImage src={imgUrl} />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Button className='w-full' variant={'ghost'} asChild>
            <Link href={'/my-page'}>내 정보</Link>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Button
            onClick={() => {
              logout()
              router.refresh()
            }}
            className='w-full'
            variant={'ghost'}
          >
            로그아웃
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
