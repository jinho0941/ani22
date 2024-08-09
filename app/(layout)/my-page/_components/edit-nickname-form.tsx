'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTransition } from 'react'
import { editUserNickname } from '@/app/action/user'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  nickname: z
    .string()
    .min(2, {
      message: '닉네임은 최소 2글자 입니다.',
    })
    .max(10, { message: '닉네임은 최대 10글자 입니다.' }),
})

type Props = {
  nickname: string
}

export function EditNicknameForm({ nickname }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname,
    },
  })

  const watchNickname = form.watch('nickname')

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { nickname } = values
    startTransition(async () => {
      const action = await editUserNickname({ nickname })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.refresh()
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 min-w-[400px] w-1/2'
      >
        <FormField
          control={form.control}
          name='nickname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>nickname</FormLabel>
              <FormControl>
                <Input placeholder='닉네임을 변경하세요..' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={
              watchNickname === nickname || !form.formState.isValid || isPending
            }
          >
            닉네임 변경하기
          </Button>
        </div>
      </form>
    </Form>
  )
}
