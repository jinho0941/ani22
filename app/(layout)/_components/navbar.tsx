import { Logo } from '@/components/logo'
import { getCurrentUser } from '@/app/data/user'

import { SearchBar } from './search-bar'
import { UserButton } from './user-button'
import { DashboardButton } from './dashboard-button'
import { ModeToggle } from './mode-toggle'

export const Navbar = async () => {
  const user = await getCurrentUser()

  return (
    <nav className='fixed w-full bg-slate-200 dark:bg-slate-700 z-20'>
      <div className='grid grid-cols-3 items-center h-16 px-10'>
        <div className='flex justify-start'>
          <Logo isLink={true} />
        </div>
        <SearchBar />
        <div className='flex justify-end gap-x-4'>
          <DashboardButton />
          <ModeToggle />
          <UserButton imgUrl={user.imageUrl!} />
        </div>
      </div>
    </nav>
  )
}
