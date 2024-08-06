import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const DashboardButton = () => {
  return (
    <Button asChild>
      <Link href={'/general'}>대시보드</Link>
    </Button>
  )
}
