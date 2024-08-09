'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRef, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { createVideoComment } from '@/app/action/video-comment'
import { useRouter } from 'next/navigation'

const MAX_CHARS = 500

const formSchema = z.object({
  comment: z
    .string()
    .min(1, {
      message: '댓글을 입력해주세요.',
    })
    .max(MAX_CHARS, {
      message: `댓글은 ${MAX_CHARS}자를 초과할 수 없습니다.`,
    }),
})

type Props = {
  videoId: string
}

export const CommentInput = ({ videoId }: Props) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: '',
    },
    mode: 'onChange',
  })

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    if (input.length <= MAX_CHARS) {
      form.setValue('comment', input, { shouldValidate: true })
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const { comment } = data

    startTransition(async () => {
      const action = await createVideoComment({ videoId, content: comment })

      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.refresh()
    })
    form.reset()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (form.formState.isValid) {
        form.handleSubmit(onSubmit)()
      }
    }
  }

  const charCount = form.watch('comment').length

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3 mt-4'>
        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative'>
                  <Textarea
                    {...field}
                    placeholder='댓글을 입력해 주세요.'
                    ref={(e) => {
                      textareaRef.current = e
                      field.ref(e)
                    }}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className='text bg-transparent overflow-hidden resize-none min-h-[8px] pr-16 pb-6'
                    maxLength={MAX_CHARS}
                  />
                  <span
                    className={`absolute bottom-2 right-2 text-sm ${
                      charCount === MAX_CHARS ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {charCount}/{MAX_CHARS}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-x-2'>
          <Button
            onClick={() => form.reset()}
            type='button'
            variant='ghost'
            disabled={charCount === 0}
          >
            취소
          </Button>
          <Button type='submit' disabled={!form.formState.isValid || isPending}>
            댓글
          </Button>
        </div>
      </form>
    </Form>
  )
}
