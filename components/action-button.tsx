'use client'

import { ActionType } from '@/type'
import { Button } from '@/components/ui/button'
import { useTransition } from 'react'
import { toast } from 'sonner'

type Props<T, R> = {
  fn: (param: T) => Promise<ActionType<R>>
  param?: T
  children: React.ReactNode
  className?: string
  isToast?: boolean
  disabled?: boolean
}

export const ActionButton = <T, R>({
  fn,
  param,
  children,
  className,
  isToast = true,
  disabled,
}: Props<T, R>) => {
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    startTransition(async () => {
      const action = await fn(param as T)
      if (!action.success) {
        isToast && toast.error(action.message)
        return
      }
      isToast && toast.success(action.message)
    })
  }

  return (
    <Button
      disabled={isPending || disabled}
      onClick={onClick}
      className={className}
      type='button'
    >
      {children}
    </Button>
  )
}
