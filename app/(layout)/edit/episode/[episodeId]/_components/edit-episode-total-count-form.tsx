'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Edit2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateEpisode } from '@/app/action/episode'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Episode } from '@prisma/client'
import { cn } from '@/lib/utils'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  totalCount: z.number().min(1, { message: '총 화수는 1 이상이어야 합니다.' }),
})

type Props = {
  episode: Episode
}

export const EditEpisodeTotalCountForm = ({ episode }: Props) => {
  const router = useRouter()

  const [isEdit, setIsEdit] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [count, setCount] = useState(episode.totalEpisodeCount ?? 1)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCount: count,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const action = await updateEpisode({
        episodeId: episode.id,
        totalEpisodeCount: count,
      })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      setIsEdit(false)
      router.refresh()
    })
  }

  const onEdit = () => {
    setIsEdit(true)
  }

  const onCancelEdit = () => {
    setIsEdit(false)
    setCount(episode.totalEpisodeCount ?? 1)
  }

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1)
  }

  const handleDecrement = () => {
    setCount((prevCount) => Math.max(1, prevCount - 1))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='totalCount'
          render={() => (
            <FormItem>
              <FormLabel>총 화수</FormLabel>
              <FormControl>
                <div className='relative'>
                  {isEdit ? (
                    <div className='flex items-center space-x-2'>
                      <Button
                        type='button'
                        size='icon'
                        onClick={handleDecrement}
                        disabled={isPending}
                      >
                        <Minus />
                      </Button>
                      <Input
                        disabled
                        className='text-center w-16'
                        type='number'
                        value={count}
                        readOnly
                      />
                      <Button
                        type='button'
                        size='icon'
                        onClick={handleIncrement}
                        disabled={isPending}
                      >
                        <Plus />
                      </Button>
                    </div>
                  ) : (
                    <Input
                      placeholder='총 화수'
                      disabled
                      className='pr-10'
                      type='number'
                      value={count}
                      readOnly
                    />
                  )}
                  {!isEdit && (
                    <Button
                      onClick={onEdit}
                      size='icon'
                      className='absolute top-1/2 right-0 transform -translate-y-1/2'
                    >
                      <Edit2 className='hover:text-sky-400' />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEdit && (
          <div className='flex justify-end gap-x-2'>
            <Button
              onClick={onCancelEdit}
              variant='destructive'
              type='button'
              disabled={isPending}
            >
              취소하기
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? '수정중' : '수정하기'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
