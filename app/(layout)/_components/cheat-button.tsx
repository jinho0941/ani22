import Link from 'next/link'

import { Button } from '@/components/ui/button'

export const CheatButton = () => {
  return (
    <Button asChild>
      <Link href={'/cheat'}>치트</Link>
    </Button>
  )
}
