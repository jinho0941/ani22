'use client'

import { usePathname } from 'next/navigation'
import { UserTypeButton } from './user-type-button'
import { Fragment } from 'react'
import { UserRole } from '@prisma/client'

const items = [
  {
    href: '/general',
    label: '일반',
    roles: ['GENERAL', 'UPLOADER', 'ADMIN'],
  },
  {
    href: '/uploader',
    label: '업로더',
    roles: ['UPLOADER', 'ADMIN'],
  },
  { href: '/admin', label: '관리자', roles: ['ADMIN'] },
]

type Props = {
  role: UserRole
}

export const UserTypeNavigation = ({ role }: Props) => {
  const pathname = usePathname()

  const filteredItems = items.filter((item) => item.roles.includes(role))

  return (
    <section className='mt-12 flex'>
      {filteredItems.map((item, index) => (
        <Fragment key={item.href}>
          <UserTypeButton
            href={item.href}
            label={item.label}
            isSelected={pathname === item.href}
          />
          {index < filteredItems.length - 1 && (
            <div className='border-r-2 border-black dark:border-white' />
          )}
        </Fragment>
      ))}
    </section>
  )
}
