import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = {
  href: string
  label: string
  isSelected: boolean
}

export const UserTypeButton = ({ href, label, isSelected }: Props) => {
  return (
    <Button
      variant={'ghost'}
      asChild
      className={cn(isSelected && 'bg-slate-200 dark:bg-slate-800')}
    >
      <Link href={href}>
        <span className='lg:text-3xl text-xl'>{label}</span>
      </Link>
    </Button>
  )
}
