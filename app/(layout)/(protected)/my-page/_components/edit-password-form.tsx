'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
import { editUserPassword } from '@/app/action/user'

const formSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
    newPassword: z
      .string()
      .min(8, '새 비밀번호는 최소 8자 이상이어야 합니다.')
      .max(100, '새 비밀번호는 100자를 초과할 수 없습니다.'),
    confirmNewPassword: z.string().min(1, '새 비밀번호를 다시 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['confirmNewPassword'],
  })

export function EditPasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const action = await editUserPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      form.reset()
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
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>현재 비밀번호</FormLabel>
              <FormControl>
                <Input type='password' placeholder='현재 비밀번호' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호</FormLabel>
              <FormControl>
                <Input type='password' placeholder='새 비밀번호' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmNewPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>새 비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='새 비밀번호 확인'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={!form.formState.isValid || isPending}>
            비밀번호 변경하기
          </Button>
        </div>
      </form>
    </Form>
  )
}
