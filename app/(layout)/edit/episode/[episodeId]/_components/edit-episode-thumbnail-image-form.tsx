'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { FileUpload } from '@/components/file-upload'
import { updateEpisode } from '@/app/action/episode'
import { Button } from '@/components/ui/button'
import { Episode } from '@prisma/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  thumbnailUrl: z.string().min(2, {
    message: '제목은 최소 2글자 이상입니다.',
  }),
})

type Props = {
  episode: Episode
}

export const EditEpisodeThumbnailImageForm = ({ episode }: Props) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [isEdit, setIsEdit] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      thumbnailUrl: episode.thumbnailUrl ?? '',
    },
  })

  const currentValues = form.watch('thumbnailUrl')
  const isDisabled =
    currentValues === episode.thumbnailUrl || currentValues === ''

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { thumbnailUrl } = values
      const action = await updateEpisode({
        episodeId: episode.id,
        thumbnailUrl,
      })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      if (action.data?.thumbnailUrl) {
        form.reset({ thumbnailUrl: action.data.thumbnailUrl })
      }
      setIsEdit(false)
      toast.success(action.message)
      router.refresh()
    })
  }

  const onEdit = () => {
    setIsEdit(true)
  }

  const onCancelEdit = () => {
    setIsEdit(false)
    form.resetField('thumbnailUrl')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='thumbnailUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>썸네일</FormLabel>
              <FormControl>
                <div className='relative'>
                  <div></div>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    endpoint='imageUploader'
                    onIconClick={onEdit}
                    changeEvent={onEdit}
                  />
                </div>
              </FormControl>
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
