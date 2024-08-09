'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { FileUpload } from '@/components/file-upload'
import { updateVideo } from '@/app/action/video'
import { Button } from '@/components/ui/button'
import { Video } from '@prisma/client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  videoUrl: z
    .string()
    .url({ message: '올바른 URL 형식이어야 합니다.' })
    .min(1, {
      message: '동영상 URL은 필수 항목입니다.',
    }),
})

type Props = {
  video: Video
}

export const EditVideoUrlForm = ({ video }: Props) => {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [isEdit, setIsEdit] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: video.url ?? '',
    },
  })

  const currentValues = form.watch('videoUrl')
  const isDisabled = currentValues === video?.url || currentValues === ''

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const { videoUrl } = values
      const action = await updateVideo({
        videoId: video.id,
        url: videoUrl,
      })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      if (action.data?.url) {
        form.reset({ videoUrl: action.data.url })
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
    form.resetField('videoUrl')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='videoUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>동영상</FormLabel>
              <FormControl>
                <FileUpload
                  onChange={field.onChange}
                  value={field.value}
                  className='aspect-video'
                  endpoint='videoUploader'
                  onIconClick={onEdit}
                  changeEvent={onEdit}
                />
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
              {isPending ? '업로드중' : '업로드하기'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
