'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { DatePicker } from '@/components/ui/date-picker'
import { updateEpisode } from '@/app/action/episode'
import { Button } from '@/components/ui/button'
import { Episode } from '@prisma/client'

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
  date: z.date().optional(),
})

type Props = {
  episode: Episode
}

export const EditEpisodeEndDateForm = ({ episode }: Props) => {
  const router = useRouter()

  const [isEdit, setIsEdit] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: episode.airDate ?? undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { date } = values
      const action = await updateEpisode({
        episodeId: episode.id,
        endDate: date,
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

  const onCancelEdit = () => {
    setIsEdit(false)
    form.resetField('date')
  }

  const onSelected = () => {
    setIsEdit(true)
  }

  const currentValues = form.watch('date')

  const isDisabled = currentValues === episode.endDate

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>종영일</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  onSelected={onSelected}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isEdit && (
          <div className='flex justify-end gap-x-2'>
            <Button
              onClick={onCancelEdit}
              variant={'destructive'}
              type='button'
              disabled={isPending || isDisabled}
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
