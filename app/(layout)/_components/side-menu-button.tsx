'use client'

import { Drama, Home, LayoutDashboard, LogOut, Menu, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/action/user'
import { Logo } from '@/components/logo'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type Props = {
  username: string
  userImg: string
}

const menuItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/my-page', icon: User, label: '내 정보' },
  { href: '/general', icon: LayoutDashboard, label: '대시보드' },
  { href: '/cheat', icon: Drama, label: '치트' },
]

export const SideMenuButton = ({ username, userImg }: Props) => {
  const router = useRouter()

  const onClick = async () => {
    await logout()
    router.refresh()
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='p-2' variant={'ghost'}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className='space-y-4'>
        <SheetHeader>
          <SheetTitle>
            <Logo isLink={true} />
          </SheetTitle>
          <SheetDescription>에니22에 오신것을 환영합니다.</SheetDescription>
        </SheetHeader>
        <div className='flex items-center gap-x-2'>
          <Avatar>
            <AvatarImage src={userImg} className='object-cover' />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span>{username}</span>
        </div>
        {menuItems.map((item) => (
          <div key={item.href}>
            <SheetClose asChild>
              <Button variant={'link'} asChild>
                <Link href={item.href}>
                  <div className='flex items-center gap-x-2'>
                    <item.icon /> <span>{item.label}</span>
                  </div>
                </Link>
              </Button>
            </SheetClose>
          </div>
        ))}
        <div>
          <SheetClose asChild>
            <Button onClick={onClick} variant={'link'}>
              <div className='flex items-center gap-x-2'>
                <LogOut /> <span>로그아웃</span>
              </div>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
