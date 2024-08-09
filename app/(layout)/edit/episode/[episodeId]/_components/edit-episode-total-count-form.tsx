'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Edit2 } from 'lucide-react'
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCount: episode.totalEpisodeCount ?? 0,
    },
  })

  const currentValues = form.watch('totalCount')
  const isDisabled = currentValues === episode.totalEpisodeCount

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const { totalCount } = values
      const action = await updateEpisode({
        episodeId: episode.id,
        totalEpisodeCount: totalCount,
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
    form.resetField('totalCount')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='totalCount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>총 화수</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    placeholder='총 화수'
                    disabled={!isEdit || isPending}
                    className={cn(!isEdit && 'pr-10')}
                    type='number'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber
                      field.onChange(Number.isNaN(value) ? undefined : value)
                    }}
                  />
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
            <Button type='submit' disabled={isDisabled || isPending}>
              {isPending ? '수정중' : '수정하기'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
