'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Textarea } from '@/components/ui/textarea'
import { updateVideo } from '@/app/action/video'
import { Button } from '@/components/ui/button'
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
  description: z.string().min(10, {
    message: '설명은 최소 10글자 이상이어야 합니다.',
  }),
})

type Props = {
  video: Video
}

export const EditVideoDescriptionForm = ({ video }: Props) => {
  const router = useRouter()

  const [isEdit, setIsEdit] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: video.description ?? '',
    },
  })

  const currentValues = form.watch()
  const isDisabled = currentValues.description === video.description

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { description } = values
      const action = await updateVideo({ videoId: video.id, description })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.refresh()
      setIsEdit(false)
    })
  }

  const onEdit = () => {
    setIsEdit(true)
  }

  const onCancelEdit = () => {
    setIsEdit(false)
    form.resetField('description')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>설명</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Textarea
                    placeholder='설명'
                    disabled={!isEdit || isPending}
                    className={cn(!isEdit && 'pr-10')}
                    {...field}
                  />
                  {!isEdit && (
                    <Button
                      onClick={onEdit}
                      size={'icon'}
                      className='absolute top-0 right-0'
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
            <Button
              type='submit'
              disabled={isDisabled || isPending || !form.formState.isValid}
            >
              {isPending ? '수정중' : '수정하기'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
