'use client'

import { LoginSchema } from '@/schema'
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
import { LoginSchemaType } from '@/type'
import { toast } from 'sonner'
import { login } from '@/app/action/user'
import { useRouter } from 'next/navigation'

const loginFields = [
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
]

export default function LoginForm() {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'admin@mail.com',
      password: 'test1234',
    },
    mode: 'onBlur',
  })

  function onSubmit(values: LoginSchemaType) {
    startTransition(async () => {
      const action = await login(values)
      if (!action.success) {
        toast.error(action.message)
        return
      }
      router.replace('/')
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {loginFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as keyof LoginSchemaType}
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
          로그인
        </Button>
      </form>
    </Form>
  )
}
