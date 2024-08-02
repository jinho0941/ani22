'use client'

import { RegisterSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
import { RegisterSchemaType } from '@/type'
import { toast } from 'sonner'
import { register } from '@/app/action/user'
import { useRouter } from 'next/navigation'

const registerFields = [
  {
    name: 'nickname',
    label: '닉네임',
    placeholder: '닉네임을 입력해 주세요',
    type: 'text',
  },
  {
    name: 'email',
    label: '이메일',
    placeholder: '이메일을 입력해 주세요',
    type: 'text',
  },
  {
    name: 'password',
    label: '비밀번호',
    placeholder: '비밀번호를 입력해 주세요',
    type: 'password',
  },
  {
    name: 'confirmPassword',
    label: '비밀번호 확인',
    placeholder: '비밀번호를 한 번 더 입력해 주세요',
    type: 'password',
  },
]

export default function RegisterForm() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  })

  function onSubmit(values: RegisterSchemaType) {
    startTransition(async () => {
      const action = await register(values)
      if (!action.success) {
        toast.error(action.message)
        return
      }
      toast.success(action.message)
      router.replace('/sign-in')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {registerFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof RegisterSchemaType}
            render={({ field: controllerField, fieldState: { error } }) => (
              <FormItem className='relative'>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    className='border-none shadow-md'
                    {...controllerField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button disabled={isPending} type='submit' className='w-full'>
          회원가입
        </Button>
      </form>
    </Form>
  )
}
