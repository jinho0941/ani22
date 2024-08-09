'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { updateVideo } from '@/app/action/video'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Video } from '@prisma/client'
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
  title: z.string().min(2, {
    message: '제목은 최소 2글자 이상입니다.',
  }),
})

type Props = {
  video: Video
}

export const EditVideoTitleForm = ({ video }: Props) => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video.title,
    },
  })

  const currentValues = form.watch('title')

  const isDisabled = currentValues === video.title

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { title } = values
      const action = await updateVideo({ videoId: video.id, title })
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
    form.resetField('title')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    placeholder='제목'
                    disabled={!isEdit || isPending}
                    className={cn(!isEdit && 'pr-10')}
                    {...field}
                  />
                  {!isEdit && (
                    <Button
                      onClick={onEdit}
                      size={'icon'}
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
              variant={'destructive'}
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
