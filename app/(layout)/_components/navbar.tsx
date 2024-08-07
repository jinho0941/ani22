import { Logo } from '@/components/logo'
import { getCurrentUser } from '@/app/data/user'

import { SearchBar } from './search-bar'
import { UserButton } from './user-button'
import { DashboardButton } from './dashboard-button'
import { ModeToggle } from './mode-toggle'
import { SideMenuButton } from './side-menu-button'
import { CheatButton } from './cheat-button'

export const Navbar = async () => {
  const user = await getCurrentUser()

  return (
    <nav className='fixed top-0 left-0 w-full bg-slate-200 dark:bg-slate-700 z-20'>
      <div className='flex items-center justify-between h-16 px-4 md:px-10'>
        <div className='flex-1 md:flex hidden justify-start'>
          <Logo isLink={true} />
        </div>
        <div className='flex-1 flex justify-center md:justify-start items-center'>
          <div className='md:hidden block mr-2'>
            <SideMenuButton username={user.nickname} userImg={user.imageUrl!} />
          </div>
          <SearchBar />
        </div>
        <div className='flex-1 hidden md:flex justify-end items-center gap-x-4'>
          <ModeToggle />
          <CheatButton />
          <DashboardButton />
          <UserButton imgUrl={user.imageUrl!} />
        </div>
      </div>
    </nav>
  )
}
