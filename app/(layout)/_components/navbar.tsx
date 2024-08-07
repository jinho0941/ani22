import { Logo } from '@/components/logo'
import { getCurrentUser } from '@/app/data/user'

import { SearchBar } from './search-bar'
import { UserButton } from './user-button'
import { DashboardButton } from './dashboard-button'
import { ModeToggle } from './mode-toggle'
import { SideMenuButton } from './side-menu-button'

export const Navbar = async () => {
  const user = await getCurrentUser()

  return (
    <nav className='fixed w-full bg-slate-200 dark:bg-slate-700 z-20'>
      <div className='grid md:grid-cols-3 items-center h-16 md:px-10 px-2'>
        <div className='md:flex hidden justify-start'>
          <Logo isLink={true} />
        </div>
        <div className='flex items-center gap-x-2'>
          <div className='md:hidden block'>
            <SideMenuButton username={user.nickname} userImg={user.imageUrl!} />
          </div>
          <SearchBar />
        </div>
        <div className='md:flex hidden justify-end gap-x-4'>
          <ModeToggle />
          <DashboardButton />
          <UserButton imgUrl={user.imageUrl!} />
        </div>
      </div>
    </nav>
  )
}
